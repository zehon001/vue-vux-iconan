

import TaskQueue from './TaskQueue';


const Downloader = function(count){
    this.downCount = count||5;
    this.downPools = [];
    this.imgs = [];
}

Downloader.getInstance = function(){
    if(!window.IMGDOWNLR){
        window.IMGDOWNLR = new Downloader();
    }
    return window.IMGDOWNLR;
}

Downloader.getInstance2 = function(){
    if(!window.IMGDOWNLR2){
        window.IMGDOWNLR2 = new Downloader();
    }
    return window.IMGDOWNLR2;
}

Downloader.prototype.start = function(pics,onComplete){

    if(!pics)pics=[];

    this.downPools = [];

    var _this = this;

    this.queue = new TaskQueue.Queue();
    pics.map((pic)=>{
        let t = new TaskQueue.Task(function(complete){
            let img = new Image();
            _this.imgs.push(img);
            pic.reloadCount = 3;
            img.src = pic.url;
            img.onload = function(){
                pic.isOk = true;
                complete();
            }
            img.onerror = function(){
                pic.reloadCount--;
                if(pic.reloadCount>0){
                    img.src="";
                    img.src = pic.url;
                }else{
                    complete();
                }
            }
            t.killer = function(){
                img.src = "";
                img=null;
                t=null;
                let i = _this.imgs.indexOf(img);
                if(i>=0)_this.imgs.splice(i,1);
            }
        })
        this.queue.push(t);
    });
    //this.queue.execute();
    let count = Math.min(this.downCount,this.queue.count());
    for(let i=0;i<count;i++){
        let task = this.downPools[i] = this.queue.pop();
        task.__index = i;
        task.execute(()=>{
            this.downPools[task.__index]=null;
            this.next();
        });
    }

    this.queue.onComplete = onComplete;
}

Downloader.prototype.stop = function(){
    this.queue&&this.queue.clear();
    for(let i=0;i<this.downPools;i++){
        if(this.downPools[i])this.downPools[i].kill();
    }
    this.downPools = [];

    this.imgs = [];
}


Downloader.prototype.next = function(){
    if(this.queue.count()>0){
        for(let i=0;i<this.downPools.length;i++){
            if(!this.downPools[i]){
                let task = this.downPools[i] = this.queue.pop();
                task.__index = i;
                task.execute(()=>{
                    this.downPools[task.__index]=null;
                    this.next();
                });
            }
        }
    }else{
        let comp = true;
        for(let i=0;i<this.downPools.length;i++){
            if(this.downPools[i]){
                comp=false;
                break;
            }
        }
        comp&&this.queue.onComplete&&this.queue.onComplete();
    }
}

export default Downloader;