class RandomUserGenerator {
  
  generate(firstNames, lastNames, mailServers, startId, count) {
    let users = [];

    for (let i = 0; i < count; i++) {
      let user = {
        id: startId + i,
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)]
      };
      user.email = `${user.firstName.toLowerCase()}.${user.lastName.toLowerCase()}@` +
      mailServers[Math.floor(Math.random() * mailServers.length)];
      user.phone = "+7(" + Math.floor(Math.random() * 1000).toString().padStart(3, "0") + ")" +
      Math.floor(Math.random() * 1000).toString().padStart(3, "0") + "-" +
      Math.floor(Math.random() * 100).toString().padStart(2, "0") + "-" +
      Math.floor(Math.random() * 100).toString().padStart(2, "0");

      user.randomData = Math.floor(Math.random() * 0xFFFFFF).toString(16);

      users[i] = user;
    }

    return users;
  }

}

const userGenerator = new RandomUserGenerator();
const users = userGenerator.generate(
  ["Vasilii", "Petr", "Nikolai", "Boris", "Vladislav", "Ivan", "Alexei", "Igor", "Vladimir", "Sergei", "Oleg"],
  ["Pupkin", "Ivanov", "Petrov", "Sidorov", "Nikolaev", "Medvedev", "Komarov", "Pushkin", "Lermontov"],
  ["gmail.com", "mail.ru", "sibmail.com", "yandex.ru", "hotmail.com"],
  5,
  10
);

console.log(JSON.stringify(users, null, 2));