describe("parseUrl", function() {

  const urls = [
    "http://sampletext.ru",
    "github.com/BmpCorp/bmpcorp.github.io",
    "https://gitlab.com/redlg/testFront2.0",
    "ftp://ftp.darkside.cc:21/",
    "127.0.0.1:8080/redlg/test-task2.1/parseUrlTest.html",
    "http://127.0.0.1:8080/redlg/test-task2.1/parseUrlTest.html#bookmark",
    "https://rsport.ria.ru/football/20181012/1143880356.html?utm_source=yxnews&utm_medium=desktop#",
    "localhost",
    "consultant://192.168.0.100:999/sample%20document%20link/?params[]=2&params[]=#article2",
    "http://кириллический.домен.рф/Путь_к_файлу?Параметр=0#Метка",
    "asdffds://top.l-e-v-e-l.domain.:443/path?param=#hash",
    "https://unpkg.com/@webcomponents/custom-elements"
  ];

  const expected = [
    {
      href: "http://sampletext.ru",
      protocol: "http:",
      hostname: "sampletext.ru",
      port: "",
      host: "sampletext.ru",
      pathname: "",
      hash: "",
      origin: "http://sampletext.ru"
    },
    {
      href: "github.com/BmpCorp/bmpcorp.github.io",
      protocol: "",
      hostname: "github.com",
      port: "",
      host: "github.com",
      pathname: "/BmpCorp/bmpcorp.github.io",
      hash: "",
      origin: "github.com"
    },
    {
      href: "https://gitlab.com/redlg/testFront2.0",
      protocol: "https:",
      hostname: "gitlab.com",
      port: "",
      host: "gitlab.com",
      pathname: "/redlg/testFront2.0",
      hash: "",
      origin: "https://gitlab.com"
    },
    {
      href: "ftp://ftp.darkside.cc:21/",
      protocol: "ftp:",
      hostname: "ftp.darkside.cc",
      port: "21",
      host: "ftp.darkside.cc:21",
      pathname: "/",
      hash: "",
      origin: "ftp://ftp.darkside.cc:21"
    },
    {
      href: "127.0.0.1:8080/redlg/test-task2.1/parseUrlTest.html",
      protocol: "",
      hostname: "127.0.0.1",
      port: "8080",
      host: "127.0.0.1:8080",
      pathname: "/redlg/test-task2.1/parseUrlTest.html",
      hash: "",
      origin: "127.0.0.1:8080"
    },
    {
      href: "http://127.0.0.1:8080/redlg/test-task2.1/parseUrlTest.html#bookmark",
      protocol: "http:",
      hostname: "127.0.0.1",
      port: "8080",
      host: "127.0.0.1:8080",
      pathname: "/redlg/test-task2.1/parseUrlTest.html",
      hash: "#bookmark",
      origin: "http://127.0.0.1:8080"
    },
    {
      href: "https://rsport.ria.ru/football/20181012/1143880356.html?utm_source=yxnews&utm_medium=desktop#",
      protocol: "https:",
      hostname: "rsport.ria.ru",
      port: "",
      host: "rsport.ria.ru",
      pathname: "/football/20181012/1143880356.html",
      hash: "#",
      origin: "https://rsport.ria.ru"
    },
    {
      href: "localhost",
      protocol: "",
      hostname: "localhost",
      port: "",
      host: "localhost",
      pathname: "",
      hash: "",
      origin: "localhost"
    },
    {
      href: "consultant://192.168.0.100:999/sample%20document%20link/?params[]=2&params[]=#article2",
      protocol: "consultant:",
      hostname: "192.168.0.100",
      port: "999",
      host: "192.168.0.100:999",
      pathname: "/sample%20document%20link/",
      hash: "#article2",
      origin: "consultant://192.168.0.100:999"
    },
    {
      href: "http://кириллический.домен.рф/Путь_к_файлу?Параметр=0#Метка",
      protocol: "http:",
      hostname: "кириллический.домен.рф",
      port: "",
      host: "кириллический.домен.рф",
      pathname: "/Путь_к_файлу",
      hash: "#Метка",
      origin: "http://кириллический.домен.рф"
    },
    {
      href: "asdffds://top.l-e-v-e-l.domain.:443/path?param=#hash",
      protocol: "asdffds:",
      hostname: "top.l-e-v-e-l.domain.",
      port: "443",
      host: "top.l-e-v-e-l.domain.:443",
      pathname: "/path",
      hash: "#hash",
      origin: "asdffds://top.l-e-v-e-l.domain.:443"
    },
    {
      href: "https://unpkg.com/@webcomponents/custom-elements",
      protocol: "https:",
      hostname: "unpkg.com",
      port: "",
      host: "unpkg.com",
      pathname: "/@webcomponents/custom-elements",
      hash: "",
      origin: "https://unpkg.com"
    }
  ];

  const badUrls = [
    "http://",
    "http://.",
    "http://../",
    "http://?",
    "http://??",
    "http://#",
    "http://##",
    "http://example.com?a=Spaces in the path",
    "//",
    "//a",
    "http:///example",
    "http://1234",
    "http:// пробел.вначале.рф",
    "http://раз.два/три(четыре)пять шесть",
    "http://-dashed-.name/",
    "http://sub.-dashed-.name",
    "http://1.1.1.1.1",
    "http://123.123.123",
    "http://domain.com#1#2",
    "http://.www.aaa.ru/",
  ];

  describe("Правильные URL", function() {
    urls.forEach((url, index) => {
      it("Парсинг " + url, function() {
        assert.deepEqual(parseUrl(url), expected[index]); 
      });
      console.log(parseUrl(url));
    });
  });

  describe("Неправильные URL", function() {
    badUrls.forEach(url => {
      it("Парсинг неправильного " + url, function() {
        assert.strictEqual(parseUrl(url), null); 
      });
    });
  });
});