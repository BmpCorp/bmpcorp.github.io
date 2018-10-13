/**
 * Разбирает строку с URL и возвращает объект, содержащий её части.
 * @param  {string} url Строка для разбора.
 * @return {object}     Объект со строковыми свойствами, в которых хранятся части URL.
 */
function parseUrl(url) {
  /*
    По частям, для удобства:
    1. Протокол - (?:([a-z]+:)\/\/)?
    2. DNS-имя или IP-адрес - ((?:[0-9a-zа-я~][0-9a-zа-я_\-~]*\.)*[a-zа-я]+\.?|(?:\d{1,3}\.){3}\d{1,3})
    3. Порт - (?::(\d{1,5}))?
    4. Путь к файлу - ((?:\/(?:[\w\.\-/]|%[0-9A-F]{2})+)+)*
    5. Параметры GET-запроса - (\?(?:[a-z][a-z0-9\[\]]*=[^\s#&?]*&)*(?:[a-z][a-z0-9\[\]]*=[^\s#&?]*))?
    6. Хэш - (#[^\s#]*)?
   */
  let matches = url.match(/^(?:([a-z]+:)\/\/)?((?:[0-9a-zа-я~][0-9a-zа-я_\-~]*\.)*[a-zа-я]+\.?|(?:\d{1,3}\.){3}\d{1,3})(?::(\d{1,5}))?((?:\/(?:[\w\.\-/]|%[0-9A-F]{2})+)+)*(\?(?:[a-z][a-z0-9\[\]]*=[^\s#&?]*&)*(?:[a-z][a-z0-9\[\]]*=[^\s#&?]*))?(#[^\s#]*)?$/i);
  let anchor = null;
  if (matches) {
    let [href, protocol, hostname, port, pathname, params, hash] = matches;
    anchor = {href, protocol, hostname, port, pathname, hash};
    // Подменяем undefined в свойствах на пустую строку, чтобы потом было удобнее склеивать части.
    Object.keys(anchor).forEach(key => {
      anchor[key] = anchor[key] || "";
    });
    anchor.host = port ? `${hostname}:${port}` : hostname;
    anchor.origin = protocol ? `${protocol}//${anchor.host}` : anchor.host;
  }
  return anchor;
}