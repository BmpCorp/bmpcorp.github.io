'use strict';

/**
 * Элемент, представляющий собой таблицу с данными пользователей, полем для фильтрации и выводом дополнительной информации.
 */
class UserDataGrid extends HTMLElement {

  /**
   * Сортировка по возрастанию.
   */
  static get SORT_ASC() {return "asc"};
  /**
   * Сортировка по убыванию.
   */
  static get SORT_DESC() {return "desc"};

  /**
   * Создание нового элемента.
   * @param  {Array}  fields         Массив со строками, обозначающими поля таблицы.
   * @param  {number} tableMaxHeight Максимальная высота таблицы (в пикселях).
   */
  constructor(fields, tableMaxHeight) {
    super();

    this._data = [];
    this._filter = "";
    this._fields = fields;
    this._sortField = null;
    this._sortDirection = null;

    tableMaxHeight = tableMaxHeight || 200;

    // Контейнер для поля и кнопки поиска.
    const searchGroup = document.createElement("div");
    searchGroup.className = "user-data-grid__search-group";

    // Поле поиска.
    const searchField = document.createElement("input");
    searchField.className = "user-data-grid__search-field";
    searchField.setAttribute("type", "search");
    searchGroup.appendChild(searchField);

    // Кнопка "Найти".
    const searchButton = document.createElement("button");
    searchButton.className = "user-data-grid__search-button";
    searchButton.innerHTML = "Найти";
    searchGroup.appendChild(searchButton);

    this.appendChild(searchGroup);

    // Контейнер для таблицы (с ограниченной высотой).
    const tableWrapper = document.createElement("div");
    tableWrapper.className = "user-data-grid__table-wrapper";
    tableWrapper.style.display = "inline-block";
    tableWrapper.style.maxHeight = tableMaxHeight + "px";
    tableWrapper.style.overflow = "auto";

    // Непосредственно таблица.
    const table = document.createElement("div");
    table.className = "user-data-grid__table";
    table.style.display = "table";

    tableWrapper.appendChild(table);

    // Колонка с идентификатором (предполагаем, что она первая).
    const idColumn = document.createElement("div");
    idColumn.className = "user-data-grid__column user-data-grid__id-column";
    idColumn.style.display = "table-column";
    table.appendChild(idColumn);

    // Остальные колонки.
    fields.slice(1).forEach(field => {
      const column = document.createElement("div");
      column.className = "user-data-grid__column";
      column.style.display = "table-column";
      table.appendChild(column);
    });

    // Заголовок таблицы.
    const headerGroup = document.createElement("div");
    headerGroup.style.display = "table-header-group";
    table.appendChild(headerGroup);

    // Строка заголовка.
    const headerRow = document.createElement("div");
    headerRow.className = "user-data-grid__header";
    headerRow.style.display = "table-row";
    headerGroup.appendChild(headerRow);

    // Ячейки с названиями полей.
    fields.forEach((field, index) => {
      const headerCell = document.createElement("div");
      headerCell.className = "user-data-grid__header-cell";
      headerCell.style.display = "table-cell";
      headerCell.style.cursor = "pointer";
      headerCell.dataset.colIndex = index;
      headerCell.innerHTML = field;
      headerRow.appendChild(headerCell);
    });

    // Тело таблицы.
    const dataGroup = document.createElement("div");
    dataGroup.className = "user-data-grid__data-group"
    dataGroup.style.display = "table-row-group";
    table.appendChild(dataGroup);

    this.appendChild(tableWrapper);

    // Элемент для вывода информации.
    const infoArea = document.createElement("p");
    infoArea.className = "user-data-grid__info-area";

    this.appendChild(infoArea);

    this.ready = this.ready.bind(this);
    this.onHeaderCellClick = this.onHeaderCellClick.bind(this);
    this.onSearchClick = this.onSearchClick.bind(this);

    document.addEventListener("DOMContentLoaded", this.ready);
  }

  /**
   * Делает таблицу интерактивной по завершении загрузки DOM.
   */
  ready() {
    this.querySelectorAll(".user-data-grid__header-cell").forEach(cell => {
      cell.addEventListener("click", this.onHeaderCellClick);
    });
    this.querySelector(".user-data-grid__search-button").addEventListener("click", this.onSearchClick);
  }

  /**
   * Загрузить и отобразить данные о пользователях.
   * @param  {string} url Откуда загружать данные.
   */
  async load(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      this._data = data;
      // Пользователь мог задать фильтр и сортировку до загрузки, учитываем это.
      this.applySorting();
      this.renderData(this.filterData(data, this._filter));
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Отобразить данные в таблице.
   * @param  {Array} data Массив с данными для отображения.
   */
  renderData(data) {
    // Убираем старые данные.
    const dataGroupElement = this.querySelector(".user-data-grid__data-group");
    dataGroupElement.innerHTML = "";

    data.forEach(user => {
      // Строка с данными пользователя.
      const tableRow = document.createElement("div");
      tableRow.className = "user-data-grid__row";
      tableRow.style.display = "table-row";

      // Ячейки таблицы с данными каждого поля, заданного в _fields.
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

  /**
   * Фильтровать данные по подстроке.
   * @param  {Array}  data   Массив данных для фильтрации.
   * @param  {string} filter Фильтр (подстрока для поиска). Пустая строка означает отсутствие фильтра.
   * @return {Array}         Отфильтрованный массив данных.
   */
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

  /**
   * Сортировка массива данных по определённому полю (на месте).
   * @param  {string} field Название поля для сортировки.
   */
  sortByField(field) {
    if (this._sortField !== field) {
      // Если сортируем по этому полю впервые, устанавливаем порядок по возрастанию.
      this._sortDirection = UserDataGrid.SORT_ASC;
    } else {
      // В противном случае меняем порядок на противоположный.
      if (this._sortDirection === UserDataGrid.SORT_ASC) {
        this._sortDirection = UserDataGrid.SORT_DESC;
      } else {
        this._sortDirection = UserDataGrid.SORT_ASC;
      }
    }
    // Запоминаем текущее поле сортировки.
    this._sortField = field;

    // Непосредственно применяем сортировку.
    this.applySorting();
  }

  /**
   * Применить сортировку с установленными ранее параметрами.
   */
  applySorting() {
    if (!this._sortField) {
      return;
    }

    // Вспомогательная функция для сортировки по значению поля. Подходит и для строк, и для идентификаторов.
    const sortByField = (user1, user2) => {
      if (user1[this._sortField] > user2[this._sortField]) {
        return 1;
      } else if (user1[this._sortField] < user2[this._sortField]) {
        return -1;
      } else {
        return 0;
      }
    }

    this._data.sort(sortByField);

    // Учитываем установленный порядок сортировки.
    if (this._sortDirection === UserDataGrid.SORT_DESC) {
      this._data = this._data.reverse();
    }
  }

  /**
   * Обработчик нажатия на ячейку в заголовке таблицы.
   * @param  {MouseEvent} event Событие, вызываемое при клике на ячейку.
   */
  onHeaderCellClick(event) {
    const field = this._fields[event.target.dataset.colIndex];
    this.sortByField(field);
    this.renderData(this.filterData(this._data, this._filter));
    this.renderSortDirection(event.target);
  }

  /**
   * Отобразить значок сортировки.
   * @param  {HTMLDivElement} activeHeaderCell Ячейка заголовка таблицы, в которой содержится название поля сортировки.
   */
  renderSortDirection(activeHeaderCell) {
    // Убираем значок у всех колонок, кроме той, по которой таблица сортирована.
    this.querySelectorAll(".user-data-grid__header-cell").forEach(cell => {
      if (cell !== activeHeaderCell) {
        cell.innerHTML = this._fields[cell.dataset.colIndex];
      }
    });

    // Добавляем значок в нужную ячейку.
    let sortFieldHeader = this._sortField + " ";
    sortFieldHeader += this._sortDirection === UserDataGrid.SORT_ASC ? "▲" : "▼";
    activeHeaderCell.innerHTML = sortFieldHeader;
  }

  /**
   * Обработчик нажатия на кнопку "Найти".
   * @param  {MouseEvent} event Событие, вызываемое при клике на кнопку.
   */
  onSearchClick(event) {
    this._filter = this.querySelector(".user-data-grid__search-field").value;
    this.renderData(this.filterData(this._data, this._filter));
  }

  /**
   * Отобразить подробную информацию о пользователе.
   * @param {object} user Объект, содержащий информацию о пользователе.
   */
  showInfoAbout(user) {
    const infoArea = this.querySelector(".user-data-grid__info-area");
    infoArea.innerHTML = `Выбран пользователь <b>${user.firstName} ${user.lastName}</b>` +
    `<br>Электронная почта: <b>${user.email}</b>` +
    `<br>Номер телефона: <b>${user.phone}</b>` + 
    `<br>Некие важные данные: <b>${user.randomData}</b>`;
  }
}