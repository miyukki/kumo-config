var app = new Vue({
  el: '#app',
  data: {
    config: '',
    address: "",
    loading: false,
  },
  methods: {
    apply: function(event) {
      let config = JSON.parse(this.config);
      let promises = [].concat(
        config.sources.reduce(function(ps, item) {
          return ps.concat(setSourceConfig(this.address, item))
        }.bind(this), []),
        config.destinations.reduce(function(ps, item) {
          return ps.concat(setDestinationConfig(this.address, item))
        }.bind(this), []),
      )
      Promise.all(promises).then(function() {
        this.loading = false;
        alert("success!");
      }.bind(this)).catch(function(err) {
        this.loading = false;
        alert("fail!");
      }.bind(this));
      this.loading = true;
    },
  }
});

function setSourceConfig(address, item) {
  let colorId = Math.floor((item.id-1) / 16) * 32 + ((item.id-1) % 16) + 1;
  return Promise.all([
    // set line1
    fetch("http://" + address + "/config?action=set&configid=0&paramid=eParamID_XPT_Source" + item.id + "_Line_1&value=" + item.label1),
    // set line2
    fetch("http://" + address + "/config?action=set&configid=0&paramid=eParamID_XPT_Source" + item.id + "_Line_2&value=" + item.label2),
    // set color
    fetch("http://" + address + "/config?action=set&configid=0&paramid=eParamID_Button_Settings_" + colorId + "&value=" + JSON.stringify({ classes: "color_" + item.color }).replace(/[\"]/g, '\\\"')),
  ]);
}

function setDestinationConfig(address, item) {
  let colorId = 16 + Math.floor((item.id-1) / 16) * 32 + ((item.id-1) % 16) + 1;
  return Promise.all([
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
  ]);
}
