var app = new Vue({
  el: '#app',
  data: {
    config: '{"sources":[{"id":1,"label1":"Source","label2":"1","color":1},{"id":2,"label1":"Source","label2":"2","color":1},{"id":3,"label1":"Source","label2":"3","color":1},{"id":4,"label1":"Source","label2":"4","color":1},{"id":5,"label1":"Source","label2":"5","color":2},{"id":6,"label1":"Source","label2":"6","color":2},{"id":7,"label1":"Source","label2":"7","color":2},{"id":8,"label1":"Source","label2":"8","color":2},{"id":9,"label1":"Source","label2":"9","color":3},{"id":10,"label1":"Source","label2":"10","color":3},{"id":11,"label1":"Source","label2":"11","color":3},{"id":12,"label1":"Source","label2":"12","color":3},{"id":13,"label1":"Source","label2":"13","color":4},{"id":14,"label1":"Source","label2":"14","color":4},{"id":15,"label1":"Source","label2":"15","color":4},{"id":16,"label1":"Source","label2":"16","color":4},{"id":17,"label1":"Source","label2":"17","color":5},{"id":18,"label1":"Source","label2":"18","color":5},{"id":19,"label1":"Source","label2":"19","color":5},{"id":20,"label1":"Source","label2":"20","color":5},{"id":21,"label1":"Source","label2":"21","color":6},{"id":22,"label1":"Source","label2":"22","color":6},{"id":23,"label1":"Source","label2":"23","color":6},{"id":24,"label1":"Source","label2":"24","color":6},{"id":25,"label1":"Source","label2":"25","color":7},{"id":26,"label1":"Source","label2":"26","color":7},{"id":27,"label1":"Source","label2":"27","color":7},{"id":28,"label1":"Source","label2":"28","color":7},{"id":29,"label1":"Source","label2":"29","color":8},{"id":30,"label1":"Source","label2":"30","color":8},{"id":31,"label1":"Source","label2":"31","color":8},{"id":32,"label1":"Source","label2":"32","color":8}],"destinations":[{"id":1,"label1":"Destination","label2":"1","color":1,"lock":false,"source":1},{"id":2,"label1":"Destination","label2":"2","color":1,"lock":false,"source":2},{"id":3,"label1":"Destination","label2":"3","color":1,"lock":false,"source":3},{"id":4,"label1":"Destination","label2":"4","color":1,"lock":false,"source":4},{"id":5,"label1":"Destination","label2":"5","color":2,"lock":false,"source":5},{"id":6,"label1":"Destination","label2":"6","color":2,"lock":false,"source":6},{"id":7,"label1":"Destination","label2":"7","color":2,"lock":false,"source":7},{"id":8,"label1":"Destination","label2":"8","color":2,"lock":false,"source":8},{"id":9,"label1":"Destination","label2":"9","color":3,"lock":false,"source":9},{"id":10,"label1":"Destination","label2":"10","color":3,"lock":false,"source":10},{"id":11,"label1":"Destination","label2":"11","color":3,"lock":false,"source":11},{"id":12,"label1":"Destination","label2":"12","color":3,"lock":false,"source":12},{"id":13,"label1":"Destination","label2":"13","color":4,"lock":false,"source":13},{"id":14,"label1":"Destination","label2":"14","color":4,"lock":false,"source":14},{"id":15,"label1":"Destination","label2":"15","color":4,"lock":false,"source":15},{"id":16,"label1":"Destination","label2":"16","color":4,"lock":false,"source":16},{"id":17,"label1":"Destination","label2":"17","color":5,"lock":false,"source":17},{"id":18,"label1":"Destination","label2":"18","color":5,"lock":false,"source":18},{"id":19,"label1":"Destination","label2":"19","color":5,"lock":false,"source":19},{"id":20,"label1":"Destination","label2":"20","color":5,"lock":false,"source":20},{"id":21,"label1":"Destination","label2":"21","color":6,"lock":false,"source":21},{"id":22,"label1":"Destination","label2":"22","color":6,"lock":false,"source":22},{"id":23,"label1":"Destination","label2":"23","color":6,"lock":false,"source":23},{"id":24,"label1":"Destination","label2":"24","color":6,"lock":false,"source":24},{"id":25,"label1":"Destination","label2":"25","color":7,"lock":false,"source":25},{"id":26,"label1":"Destination","label2":"26","color":7,"lock":false,"source":26},{"id":27,"label1":"Destination","label2":"27","color":7,"lock":false,"source":27},{"id":28,"label1":"Destination","label2":"28","color":7,"lock":false,"source":28},{"id":29,"label1":"Destination","label2":"29","color":8,"lock":false,"source":29},{"id":30,"label1":"Destination","label2":"30","color":8,"lock":false,"source":30},{"id":31,"label1":"Destination","label2":"31","color":8,"lock":false,"source":31},{"id":32,"label1":"Destination","label2":"32","color":8,"lock":false,"source":32}]}',
    address: "192.168.10.191",
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
