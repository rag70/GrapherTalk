/** Copyright (c) http://lynza.com . All rights reserved. 
 * 
 * @copyright LYNZA
 * @author Roberto Alonso Gomez
 * @license MIT License, https://opensource.org/licenses/MIT
*/

declare let $ : any;

// const grapherUrl:string = "https://dev.lynza.com/lz/site/tools/grapher";

const grapherUrl:string = "../Desmos/index.html";

class GTalk {

    public Wnd : Window|null = null;
    public txSend:any;

    constructor() {
        $( document ).ready(() => this.init());
    }

    public init():void {
        this.txSend = $("#txSend");

        $("#btOpen").click(()=>  this.open());
        $("#btOpenPop").click(()=>  this.openPopUp());
        $("#btSend").click(() => this.sent(this.txSend.val()));
        $("button[data-cm]").click((ev:Event) => this.txSend.val($(ev.currentTarget).data("cm")));

        $(window).on("message", (ev:any) => {
            let oev: any = ev.originalEvent;
            if (oev != null) {
                $("#taResult").val(oev.data);
            }
        });
    }

    public open():void {
        this.Wnd = window.open(grapherUrl, "_blank");
    }

    public openPopUp():void {
        this.Wnd = window.open(grapherUrl, "sample", "resizable");
    }

    public sent(sdt:string):void {
        if (this.Wnd!=null) {
            this.Wnd.postMessage(sdt, this.Wnd.location.href);
        }
    }
}

new GTalk();