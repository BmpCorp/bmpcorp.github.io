'use strict';

class UserDataGrid extends HTMLElement {

  static get SORT_ASC() {return "asc"};
  static get SORT_DESC() {return "desc"};

  constructor() {
    super();

    this._data = [];
    this._filter = "";
    this._fields = ["id", "firstName", "lastName", "email", "phone"];
    this._sortField = null;
    this._sortDirection = null;

    const searchGroup = document.createElement("div");
    searchGroup.className = "user-data-grid__search-group";

    const searchField = document.createElement("input");
    searchField.className = "user-data-grid__search-field";
    searchField.setAttribute("type", "search");
    searchGroup.appendChild(searchField);

    const searchButton = document.createElement("button");
    searchButton.className = "user-data-grid__search-button";
    searchButton.innerHTML = "Найти";
    searchGroup.appendChild(searchButton);

    this.appendChild(searchGroup);

    const table = document.createElement("div");
    table.className = "user-data-grid__table";
    table.style.display = "table";

    const idColumn = document.createElement("div");
    idColumn.className = "user-data-grid__column user-data-grid__id-column";
    idColumn.style.display = "table-column";
    table.appendChild(idColumn);

    this._fields.slice(1).forEach(field => {
      const column = document.createElement("div");
      column.className = "user-data-grid__column";
      column.style.display = "table-column";
      table.appendChild(column);
    });

    const headerGroup = document.createElement("div");
    headerGroup.style.display = "table-header-group";
    table.appendChild(headerGroup);

    const headerRow = document.createElement("div");
    headerRow.className = "user-data-grid__header";
    headerRow.style.display = "table-row";
    headerGroup.appendChild(headerRow);

    this._fields.forEach((field, index) => {
      const headerCell = document.createElement("div");
      headerCell.className = "user-data-grid__header-cell";
      headerCell.style.display = "table-cell";
      headerCell.style.cursor = "pointer";
      headerCell.dataset.colIndex = index;
      headerCell.innerHTML = field;
      headerRow.appendChild(headerCell);
    });

    const dataGroup = document.createElement("div");
    dataGroup.className = "user-data-grid__data-group"
    dataGroup.style.display = "table-row-group";
    table.appendChild(dataGroup);

    this.appendChild(table);

    const infoArea = document.createElement("p");
    infoArea.className = "user-data-grid__info-area";

    this.appendChild(infoArea);

    this.ready = this.ready.bind(this);
    this.onHeaderCellClick = this.onHeaderCellClick.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);

    document.addEventListener("DOMContentLoaded", this.ready);
  }

  ready() {
    this.querySelectorAll(".user-data-grid__header-cell").forEach(cell => {
      cell.addEventListener("click", this.onHeaderCellClick);
    });
    this.querySelector(".user-data-grid__search-button").addEventListener("click", this.onSearchClick);
  }

  async load(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      this._data = data;
      this._filter = "";
      this.renderData(data);
    } catch (error) {
      console.log(error);
    }
  }

  renderData(data) {
    const dataGroupElement = this.querySelector(".user-data-grid__data-group");
    dataGroupElement.innerHTML = "";

    data.forEach(user => {
      const tableRow = document.createElement("div");
      tableRow.className = "user-data-grid__row";
      tableRow.style.display = "table-row";

      this._fields.forEach(field => {
        const tableCell = document.createElement("div");
        tableCell.className = "user-data-grid__cell";
        tableCell.style.display = "table-cell";

        tableCell.innerHTML = user[field];
        tableRow.appendChild(tableCell);
      });

      tableRow.addEventListener("click", () => this.showInfoAbout(user));

      dataGroupElement.appendChild(tableRow);
    });
  }

  filterData(data, filter) {
    if (!filter) {
      return data.slice();
    }

    const filterString = filter.toLowerCase();
    const filteredData = data.filter(user => {
      return Object.values(user).some(value => {
        const valueString = value.toString().toLowerCase();
        return valueString.includes(filterString);
      });
    });

    return filteredData;
  }

  sortByField(field) {

    const sortById = (user1, user2) => user1.id - user2.id;
    
    const sortByOtherField = (user1, user2) => {
      if (user1[this._sortField] > user2[this._sortField]) {
        return 1;
      } else if (user1[this._sortField] < user2[this._sortField]) {
        return -1;
      } else {
        return 0;
      }
    }

    if (this._sortField !== field) {
      this._sortDirection = UserDataGrid.SORT_ASC;
    } else {
      if (this._sortDirection === UserDataGrid.SORT_ASC) {
        this._sortDirection = UserDataGrid.SORT_DESC;
      } else {
        this._sortDirection = UserDataGrid.SORT_ASC;
      }
    }
    this._sortField = field;

    if (field === "id") {
      this._data.sort(sortById);
    } else {
      this._data.sort(sortByOtherField);
    }

    if (this._sortDirection === UserDataGrid.SORT_DESC) {
      this._data = this._data.reverse();
    }
  }

  onHeaderCellClick(event) {
    const field = this._fields[event.target.dataset.colIndex];
    this.sortByField(field);
    this.renderData(this.filterData(this._data, this._filter));
    this.renderSortDirection(event.target);
  }

  renderSortDirection(activeHeaderCell) {
    this.querySelectorAll(".user-data-grid__header-cell").forEach(cell => {
      if (cell !== activeHeaderCell) {
        cell.innerHTML = this._fields[cell.dataset.colIndex];
      }
    });
    let sortFieldHeader = this._sortField + " ";
    sortFieldHeader += this._sortDirection === UserDataGrid.SORT_ASC ? "▲" : "▼";
    activeHeaderCell.innerHTML = sortFieldHeader;
  }

  onSearchClick(event) {
    this._filter = this.querySelector(".user-data-grid__search-field").value;
    this.renderData(this.filterData(this._data, this._filter));
  }

  showInfoAbout(user) {
    const infoArea = this.querySelector(".user-data-grid__info-area");
    infoArea.innerHTML = `Выбран пользователь <b>${user.firstName} ${user.lastName}</b>` +
    `<br>Электронная почта: <b>${user.email}</b>` +
    `<br>Номер телефона: <b>${user.phone}</b>`;
  }
}