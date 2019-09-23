    
/**任务实体 
 * execute:执行的函数,参数是一个完成回调通知,执行完毕后必须调用一下
*/
var Task = function(execute){
    this._executer = execute;
    this._executing = false;
    this._killer = null;
    this.onComplete = null;

    Object.defineProperties(this,{
        killer:{
            set:function(value){
                this._killer = value;
            }
        }
    });
}


/**执行 */
Task.prototype.execute = function(complete){
    if(this._executing)return;
    this._executing = true;
    this.onComplete = complete;
    this._executer(this.complete.bind(this));
}

Task.prototype.complete = function(param){
    this.onComplete&&this.onComplete(param);
}

Task.prototype.kill = function(){
    this._killer&&this._killer();
    this.onComplete = null;//不让完成回调
}



var Queue = function(){
    this._queue = [];
    this._executing = false;
    this.onComplete = null;
    this.currentTask = null;
}

/**出队 */
Queue.prototype.pop = function(){
    return this._queue.length>0?this._queue.shift():null;
}
/**入队 */
Queue.prototype.push = function(task){
    this._queue.push(task);
}
/**清空队列 */
Queue.prototype.clear = function(){
    this.currentTask&&this.currentTask.kill();
    this._queue = [];
    this._executing = false;
}

/**数量 */
Queue.prototype.count = function(){
    return this._queue.length;
}

/**执行队列 */
Queue.prototype.execute = function(){
    if(this._executing)return;
    this._executing = true;

    //取出任务
    let task = this.pop();
    this.currentTask = task;

    if(!task){//任务完成
        this.onComplete&&this.onComplete();
    }else{//执行
        task.execute(this.next.bind(this));
    }
}

Queue.prototype.next = function(){
    this._executing = false;
    this.execute();
}


export default { Task,Queue }

//module.exports = { Task,Queue }