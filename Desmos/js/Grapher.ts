/** Copyright (c) http://lynza.com . All rights reserved. 
 * 
 * @copyright LYNZA
 * @author Roberto Alonso Gomez
 * @license MIT License, https://opensource.org/licenses/MIT
*/

// declare let $: any;
declare let define: any;
declare let require: any;
declare let viewLs: any;

class Grapher {
    calculator: any;
    view: any;

    constructor() {
        this.calculator = require("main/calc_desktop");

        $(document).ready(() => this.ready());
        $(window).on("message", (ev: any) => this.receiveMessage(ev));
    }

    public ready(): void {
        // var self = this;
        $("#btOpen").click(() => {
            this.toggleNav();
            $("#btOpen").hide();
        });
        $("#btOpen").hide();
        $("#clSideBar").click(() => {
            this.toggleNav();
            $("#btOpen").show();
        });

        setTimeout(() => this.AddQueryEqu(), 100);

        this.Samples();
    }

    public toggleNav(): void {
        let sb:any = $("#sideNav");
        sb.css("width", (sb.css("width") === "0px") ? "280px" : "0px");
    }

    public Samples(): void {
        let examples:any = require("mygraphs/examples");
        for (let i:number = 0; i < examples.length; i++) {
            let v:any = examples[i];
            if (v != null) {
                let bt:any = $("<button></button>");
                bt.html("<img src=\"" + v.thumbURL + "\"/>" + v.displayTitle);
                bt.data("graph", v.graphData);
                bt.click((ev: any) => this.addSample(ev));
                let li:any = $("<li />");
                li.append(bt);
                $("#lsSamples").append(li);
            }
        }
    }

    public addSample(ev: any): void {
        if (this.calculator != null) {
            let expr:any = $(ev.currentTarget).data("graph");
            this.calculator.setState(expr);
        }
    }

    public parse_query_string(query: string): any {
        if (query.charAt(0) === "?") {
            query = query.substr(1);
        }
        let vars:any = query.split("&");
        let query_string: any = {};
        for (let i:number = 0; i < vars.length; i++) {
            let pair:string[] = vars[i].split("=");
            let key: string = decodeURIComponent(pair[0]);
            let value:string = decodeURIComponent(pair[1]);

            if (typeof query_string[key] === "undefined") {
                query_string[key] = decodeURIComponent(value);
            } else if (typeof query_string[key] === "string") {
                let arr:string[] = [query_string[key], decodeURIComponent(value)];
                query_string[key] = arr;
            } else {
                query_string[key].push(decodeURIComponent(value));
            }
        }
        return query_string;
    }

    public AddQueryEqu(): void {
        const par:string = "e";
        let query:string = window.location.search;
        let e:any = this.parse_query_string(query);
        let s:string;
        if ((e != null) && ((s = e[par]) != null)) {
            let a: string[] = s.split(";");
            if (this.calculator != null) {
                for (let i:number = 0; i < a.length; i++) {
                    this.calculator.setExpression({
                        id: this.getNewId() + i,
                        latex: a[i] });
                }
            }
        }
    }

    public receiveMessage(event: any):void {
        let ev: any = event.originalEvent;
        if ((ev != null) && (this.calculator != null)) {
            let s: string = ev.data;
            let ix: number = s.indexOf(":");
            let cmd: string;
            if (ix !== -1) {
                cmd = s.substr(0, ix);
                s = s.substr(ix + 1);
            } else {
                cmd = s;
                s = "";
            }

            let sendBk:Function = function (s:string):void {
                ev.source.postMessage(s, ev.origin);
            };

            let sendBkJs:Function = function (s:string):void {
                sendBk(JSON.stringify(s));
            };

            let t: any;
            let id: number|undefined;
            let flds: number[] = [];
            let cfld: number|undefined = undefined;
            switch (cmd)  {
                case "exp": // list of expresion by com
                    {
                        s = unescape(s);
                        let a:string[] = s.split(";");
                        for (let i:number = 0; i < a.length; i++) {
                            id = undefined;
                            s = a[i];
                            if (s === "-") {
                                // clear all
                            } else if (s.charAt(0) === "'") {
                                id = this.addText(s.substr(1));
                            } else if (s.charAt(0) === "<") {
                                id = this.addFolder(s.substr(1));
                                if (cfld !== undefined) {
                                    this.addIdToFld(cfld, id);
                                    flds.push(cfld);
                                }
                                cfld = id;
                                id = undefined;
                            } else if (s.charAt(0) === ">") {
                                cfld = flds.pop();
                            } else {
                                id = this.getNewId();
                                this.calculator.setExpression({ id: id, latex: s, hidden: true });
                            }
                            if ((cfld !== undefined) && (id !== undefined)) {
                                this.addIdToFld(cfld, id);
                            }
                        }
                        this.Update();
                        break;
                    }
                case "gst":  // get State
                    {
                        sendBkJs(this.calculator.getState());
                        break;
                    }
                case "sst":  // set State
                    {
                        this.calculator.setState(JSON.parse(s));
                        sendBk("ok");
                        break;
                    }
                case "cx": // respond Ok for notify that is conectec
                    {
                        sendBk("ok");
                        break;
                    }
                case "nFld": // new folder
                    {
                        sendBk(this.addFolder(s));
                        break;
                    }
                case "nTx": // new Text
                    {
                        sendBk(this.addText(s));
                        break;
                    }
                case "nEx": // new expresion
                    {
                        t = this.view.newExpression();
                        sendBkJs(t);
                        break;
                    }
                case "nTbl": // new table
                    {
                        t = this.view.newTable();
                        sendBkJs(t);
                        break;
                    }
                case "gexps":  // get all expresions
                    {
                        t = this.calculator.getExpressionsModel();
                        sendBkJs(t.getState());
                        break;
                    }
                case "gsel": {  // get select element
                    sendBkJs(this.getSelected());
                    break;
                }
                case "cls": {   // clear
                    this.Clear();
                    break;
                }
                case "sopt": { // set Options
                    this.calculator.setOptions(JSON.parse(s));
                    break;
                }
            }
        }
    }

    public addText(s: string): number {
        return this.addObj({ text: s });
    }

    public addFolder(s: string): number {
        return this.addObj({ type: "folder", title: s, collapsed: true});
    }

    public addObj(v:any):number {
        let md:any = this.calculator.getExpressionsModel();
        v.id = this.getNewId();
        let obj:any = md.fromState(v);
        md.addItem(obj);
        return v.id;
    }

    public addIdToFld(fld: number, elem: number):void {
        let md:any = this.calculator.getExpressionsModel();
        let fl: any = md.getItemById(fld);
        if ((fl != null) && (fl.type === "folder")) {
            fl.memberIds[elem] = true;
            md.updateItemById(fld, fl);
            md.updateItemById(elem, md.getItemById(elem));
        }
    }

    public getSelected():any {
        let md:any = this.calculator.getExpressionsModel();
        let t:any = md.getSelected();
        return md.getItemById(t.id);
    }

    public getNewId(): number {
        let md:any = this.calculator.getExpressionsModel();
        let i: number = md.getItemCount();
        while (md.getItemById(i) !== undefined) {
            i++;
        }
        return i;
    }

    public Clear(): void {
        let md:any = this.calculator.getExpressionsModel();
        md._removeAllItems();
        this.Update();
    }

    public Update():void {
        let md:any = this.calculator.getExpressionsModel();
        let l:any = md.getState();
        md.setState(l);
    }

    public DoList(cmd:string):void{
        let view:any =  require("expressions/list_view");
        //if (view!=null) {
        // }
    }

}

new Grapher();
