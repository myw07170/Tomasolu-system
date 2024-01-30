// 实现一个自定义组件tomasolu-view
Vue.component("tomasolu-view", 
{
    template: $("#template-tomasolu-view").html(),
    data: function () {
        let addresses = new Array(16);
        for (let i = 0; i !== 16; i += 1)
            addresses[i] = i;
        return {
            fpu: new FPU(),
            memory_query_addresses: addresses,
            loading: true,
            example_instructions_list: test_instructions_list,
            step: 1,
            alert_list: [],
        };
    },
    created: function () {
        if (apply_test(test_function_list, console.log))
            this.popup_alert("Unit Test All Pass", "success");
        else
            this.popup_alert("Unit Test Failed. Open console to view detail.", "danger");
    },
    methods: {
        next_cycle: function () {
            this.fpu.cycle_pass(this.step);
            this.$forceUpdate();
        },
        last_cycle: function () {
            let togo = this.fpu.cycle_passed - this.step;
            if (togo < 0) {
                this.popup_alert("can't go back to the time before FPU created", "danger");
                return;
            }
            let new_fpu = new FPU();
            _.each(this.fpu.instruction_list, function (ins) {
                new_fpu.add_instruction(new Instruction(ins.op, ins.rs, ins.rt, ins.rd));
            });
            this.fpu = new_fpu;
            this.fpu.cycle_pass(togo);
            this.$forceUpdate();
        },
        range: function (begin, stop, step=1) {
            let ret = [];
            for (let i = 0; i !== stop; i += step)
                ret.push(i);
            return ret;
        },
        initialize: function () {
            this.fpu = new FPU();
            this.loading = true;
        },
        push_empty_instruction: function () {
            if (!this.loading)
                return;
            this.fpu.add_instruction(new Instruction("ld", "F1", "0", "F1"));
        },
        pop_empty_instruction: function () {
            if (!this.loading)
                return;
            this.fpu.instruction_list.pop();
        },
        load_example_instructions: function (idx) {
            this.initialize();
            _.each(this.example_instructions_list[idx], _.bind(function (ins) {
                this.fpu.add_instruction(new Instruction(ins.op, ins.rs, ins.rt, ins.rd));
            }, this));
        },
        popup_alert: function(msg, type="default", strong="") {
            this.alert_list.push({type: type, strong: strong, msg: msg});
        },
        valid_or_default: function(val, _default) {
            if (val === undefined || val === null)
                return _default;
            else
                return val;
        },
        register_status: function (name) {
            if (name in this.fpu.register_file.data)
                return JSON.stringify(this.fpu.register_file.data[name]);
            else
                return name;
        },
        load_local_file_input: function (evt) {
            if (!this.loading)
                return;
            this.initialize();
            let files = evt.target.files; // FileList object
            for (let i = 0, f; f = files[i]; i++) {
                let reader = new FileReader();
                reader.onload = (_.bind(function(theFile) {return _.bind(function(e) {this.parse_input_text(e.target.result);}, this);}, this))(f);
                reader.readAsText(f);
            }
        },
        parse_input_text: function (text) {
            if (!this.loading)
                return;
            let lines = text.split(/[\r\n]+/g);
            for (let idx = 0; idx < lines.length; ++idx) {
                let line = lines[idx];
                //不能预先定义regexp变量，会出问题
                let lt_match = /\s*(\w+)\s+(F\d+)\s*,\s*([+\-]?\d+)\s*/g.exec(line);
                let fp_match = /\s*(\w+)\s+(F\d+)\s*,\s*(F\d+)\s*,\s*(F\d+)\s*/g.exec(line);
                let match = null;
                if (fp_match !== null)
                    match = fp_match;
                else if (lt_match !== null)
                    match = lt_match;

                if (match !== null) {
                    let op = match[1].toLowerCase();
                    if (op === "ld" || op === "st")
                    {
                        this.fpu.add_instruction(new Instruction(op, match[2], match[3], ""));
                    }
                    else if (op === "addd" || op === "multd" || op === "divd" || op === "subd")
                    {
                        this.fpu.add_instruction(new Instruction(op, match[3], match[4], match[2]));
                    }
                }
            }
        }

    }
    ,
    computed: {
    }
});

Vue.component("alert-banning", {
    template: $("#tmplt-alert").html(),
    props: ["type", "strong", "msg"]
});

let app = new Vue({
    el: "#te-view-div",
    data: {
    }
});

$(function test() {
});