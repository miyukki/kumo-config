var app = new Vue({
  el: '#app',
  data: {
    config: "",
    address: "",
    loading: false,

    cueCount: 0,
    successCueCount: 0,
  },
  computed: {
    progress: function () {
      return Math.round((this.successCueCount / this.cueCount) * 100)
    },
  },
  methods: {
    window:onload = function() {
      if (location.hash.length > 0) {
        let hash = location.hash.substr(1);
        let data = hash.split("!");
        this.address = data[0];
        this.config = atob(decodeURIComponent(data[1]));
      }
    },
    apply: function () {
      this.successCueCount = 0;
      this.loading = true;

      let config = JSON.parse(this.config);
      let promises = [].concat(
        config.sources.flatMap(function (item) { return setSourceConfig(this.address, item) }.bind(this)),
        config.destinations.flatMap(function (item) { return setDestinationConfig(this.address, item) }.bind(this)),
      ).map(function (promise) {
        return promise.then(function () {
          return this.successCueCount++;
        }.bind(this))
      }.bind(this));
      this.cueCount = promises.length;

      Promise.all(promises).then(function () {
        this.loading = false;
        alert("success!");
      }.bind(this)).catch(function (err) {
        this.loading = false;
        alert("fail!");
      }.bind(this));
    },
  }
});

function setSourceConfig(address, item) {
  let colorId = Math.floor((item.id - 1) / 16) * 32 + ((item.id - 1) % 16) + 1;
  return [
    // set line1
    fetch("http://" + address + "/config?action=set&configid=0&paramid=eParamID_XPT_Source" + item.id + "_Line_1&value=" + item.label1),
    // set line2
    fetch("http://" + address + "/config?action=set&configid=0&paramid=eParamID_XPT_Source" + item.id + "_Line_2&value=" + item.label2),
    // set color
    fetch("http://" + address + "/config?action=set&configid=0&paramid=eParamID_Button_Settings_" + colorId + "&value=" + JSON.stringify({ classes: "color_" + item.color }).replace(/[\"]/g, '\\\"')),
  ];
}

function setDestinationConfig(address, item) {
  let colorId = 16 + Math.floor((item.id - 1) / 16) * 32 + ((item.id - 1) % 16) + 1;
  return [
    // set line1
    fetch("http://" + address + "/config?action=set&configid=0&paramid=eParamID_XPT_Destination" + item.id + "_Line_1&value=" + item.label1),
    // set line2
    fetch("http://" + address + "/config?action=set&configid=0&paramid=eParamID_XPT_Destination" + item.id + "_Line_2&value=" + item.label2),
    // set color
    fetch("http://" + address + "/config?action=set&configid=0&paramid=eParamID_Button_Settings_" + colorId + "&value=" + JSON.stringify({ classes: "color_" + item.color }).replace(/[\"]/g, '\\\"')),
    // set lock
    fetch("http://" + address + "/config?action=set&configid=0&paramid=eParamID_XPT_Destination" + item.id + "_Locked&value=" + (item.lock ? "1" : "0")),
    // set source
    fetch("http://" + address + "/config?action=set&configid=0&paramid=eParamID_XPT_Destination" + item.id + "_Status&value=" + item.source),
  ];
}
