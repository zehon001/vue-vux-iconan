<template>
    <div class="pic-view">
        <div class="controller-view">
            <hide-nav-bar></hide-nav-bar>
            <transition name="slide-down">
                <div class="menu" v-show="showMenu">
                    <div class="header-menu">
                        <header-bar></header-bar>
                        <button type="button" class="definition-menu" @click="showDefinitionMenu = true">
                            {{menus[currentDefinition]}}
                        </button>
                    </div>
                    <div class="mask" @click="showMenu = false"></div>
                </div>
            </transition>
            <div class="controller-area">
                <div class="menu-area" @click="showMenu = true"></div>
            </div>
            <img class="prompt-img" src="@/assets/image/prompt.png" v-if="showPrompt" @click="hidePrompt">
            <div class="page-tip">
                {{currentPictureIndex + 1}} / {{maxPictureIndex}}
            </div>
            <actionsheet v-model="showDefinitionMenu" :menus="menus" @on-click-menu="menuClick" show-cancel></actionsheet>
        </div>

        <ul class="img-area" :style="{ top }">
            <li class="picture-img" :picture="o" v-for="(pic, index) in pictures" :key="index">
                <img class="picture-img" :src="pic"/>
                <div class="continue-read-next-chapter" v-if="index==pictures.length-1">
                    <button class="readnext-btn" type="button" @click="readNextChapter" v-if="nextChapter.id">继续阅读下一卷</button>
                    <button class="readnext-btn" type="button" @click="readNextChapter" v-if="!nextChapter.id">后面没有啦，返回首页</button>
                </div>
            </li>
        </ul>

        

    </div>
</template>

<script>
import { Actionsheet } from "vux";
import HideNavBar from "@/components/common/HideNavBar";
import HeaderBar from "@/components/common/HeaderBar";
import { setTimeout } from 'timers';
import Vue from "vue";

//import myTouch from '../tools/Touch'
//myTouch(Vue)
// v-touch:scaleTouch="{func: scalePic, param: ''}" v-touch:slideTouch="{func: movePic, param: ''}"
export default {
    name: "Picture",
    data() {
        return {
            baseLeft : 0,
            baseTop: 0,
            bodyWidth: document.body.clientWidth,
            ele: null, // 不能在这里设置， dom还没有生成
            isScaleMode:false,

            //pictures: ["http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0001_80337.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0002_20884.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0003_29816.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0004_17150.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0005_16582.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0006_96224.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0007_19393.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0008_61627.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0009_76923.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0010_19846.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0011_12325.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0012_13480.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0013_76974.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0014_10007.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0015_65697.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0016_49238.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0017_89557.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0018_17179.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0019_15264.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0020_30376.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0021_13055.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0022_19893.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0023_15769.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0024_14377.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0025_49427.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0026_57157.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0027_94917.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0028_20751.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0029_82945.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0030_13800.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0031_37586.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0032_87214.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0033_11733.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0034_15393.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0035_28953.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0036_38935.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0037_57291.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0038_17506.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0039_80894.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0040_13749.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0041_64036.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0042_10614.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0043_10578.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0044_35758.JPG","http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0045_36164.JPG"],
            pictures:[],
            currentPictureIndex: 0,
            maxPictureIndex: 45,
            currentDefinition: localStorage.getItem("picture-definition") || "@!z3",
            currentPictureUrl: "http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0001_80337.JPG",
            animatePictureUrl: "http://165.94201314.net/dm04//ok-comic02/kt3/zjdzr/act_084/z_0001_80337.JPG",
            showMenu: false,
            showDefinitionMenu: false,
            menus: {
                "title.noop": "<span class=menu-tip>请选择清晰度</span>",
                "@!z0": "原画",
                "@!z1": "超清",
                "@!z3": "高清",
                "@!z4": "标清",
                "@!z5": "低清"
            },
            showPrompt: localStorage.getItem("has-show-prompt") != "yes",
            opus: {},
            chapter: {
                id: this.$route.params.chapterid
            },
            nextChapter: {},
            showReadNext: false,
            //当前动画是否是向下一页
            animateIsNext: true,
            //当前动画是否播放完成，如果没播放完就点下一页则强制结束
            animateIsEnd: true
        };
    },
    methods: {
        //上一页
        pret: function (index) {
            let that = this;

            if (that.maxPictureIndex > 0 && that.currentPictureIndex > 0) {
                that.animatePictureUrl = that.pictures[that.currentPictureIndex].url + that.currentDefinition;
                setTimeout(() => {
                    that.currentPictureUrl = that.pictures[--that.currentPictureIndex].url + that.currentDefinition;
                }, 10);
                this.$refs.animateDom.dispatchEvent(new Event("pret"));
                that.animateIsNext = false;
                that.animateIsEnd = false;
                that.loadPret();
            }
        },
        //下一页
        next: function () {
            let that = this;
            if (that.animateIsEnd == false) {
                that.$refs.animateDom.dispatchEvent(new Event("transitionend"));
            }
            if (that.maxPictureIndex > 0 && that.currentPictureIndex < that.maxPictureIndex - 1) {
                that.animatePictureUrl = that.pictures[that.currentPictureIndex + 1].url + that.currentDefinition;
                that.$refs.animateDom.dispatchEvent(new Event("next"));
                that.animateIsNext = true;
                that.animateIsEnd = false;
                that.loadNext();
            }
            else if (that.maxPictureIndex > 0 && that.currentPictureIndex >= that.maxPictureIndex - 1) {
                that.showReadNext = true;
            }
        },
        animationEnd: function () {
            let that = this;
            that.animateIsEnd = true;
            if (that.animateIsNext) {
                if (that.maxPictureIndex > 0 && that.currentPictureIndex < that.maxPictureIndex - 1) {
                    that.currentPictureUrl = that.pictures[++that.currentPictureIndex].url + that.currentDefinition;
                }
            }
            //记录阅读历史
            that.recordHistory();
        },
        //点击菜单
        menuClick: function (definition, name) {
            if (name) {
                this.showMenu = false;
                this.currentDefinition = definition;
                localStorage.setItem("picture-definition", definition);
                this.currentPictureUrl = this.pictures[this.currentPictureIndex].url + this.currentDefinition;
                this.loadNext();
            }
        },
        //加载上2张图片
        loadPret: function () {
            let that = this;
            if (that.currentPictureIndex > 0) {
                let imgObj = new Image();
                imgObj.src = that.pictures[that.currentPictureIndex - 1].url + that.currentDefinition;
            }
            if (that.currentPictureIndex > 1) {
                let imgObj = new Image();
                imgObj.src = that.pictures[that.currentPictureIndex - 2].url + that.currentDefinition;
            }
        },
        //加载下2张图片
        loadNext: function () {
            let that = this;
            if (that.currentPictureIndex < that.maxPictureIndex - 1) {
                let imgObj = new Image();
                imgObj.src = that.pictures[that.currentPictureIndex + 1].url + that.currentDefinition;
            }
            if (that.currentPictureIndex < that.maxPictureIndex - 2) {
                let imgObj = new Image();
                imgObj.src = that.pictures[that.currentPictureIndex + 2].url + that.currentDefinition;
            }
        },
        //记录阅读历史
        recordHistory: function () {
            let readHistory = {
                opusName: this.opus.name,
                chapterid: this.chapter.id,
                chapterName: this.chapter.name,
                pictureIndex: this.currentPictureIndex + 1
            };
            localStorage.setItem("read-history", JSON.stringify(readHistory));
        },
        //隐藏操作提示
        hidePrompt: function () {
            this.showPrompt = false;
            localStorage.setItem("has-show-prompt", "yes");
        },
        //阅读下一卷
        readNextChapter: function () {
            if (this.nextChapter.id) {
                this.$router.replace("/picture/" + this.nextChapter.id);
                this.$router.go(0);
            }
            else {
                //如果已经阅读完了，就删除历史并跳回首页
                localStorage.removeItem("read-history");
                this.$router.push("/home");
            }
        },
        scalePic: function(e,param, is_endScale){
            //this.ele = $('img_area')[0]; // 这个应该在图片显示的时候设置
            this.ele = document.getElementsByClassName('img-area')[0]; // 这个应该在图片显示的时候设置
            this.isScaleMode = true;
            console.log(this.ele,param);
            Vue.prototype.instance.$vux.toast.show(""+param);
            let nodeStyle = this.ele.style.transform;
            let changeSize = nodeStyle ?  parseFloat(nodeStyle.slice(nodeStyle.indexOf('scale')+6)) : 0;
            if(is_endScale){
              // 缩放图片结束，要重新计算定位
              this.setMaxdisp(changeSize,parseInt(this.ele.style.marginLeft), parseInt(this.ele.style.marginTop), 'scale');
              //this.isScaleMode = false;
              return 
            }
            if(nodeStyle){
              // 如果存在的话，就说明已经设置了，scale已经改变了
              let currScaleSize = changeSize + param/10; 
              currScaleSize > 3 ? currScaleSize = 3 : null
              currScaleSize < 1 ? currScaleSize = 1 : null
              this.ele.style.transform = 'translate(-50%, -50%) scale('+currScaleSize+','+currScaleSize+')';
            }else{ // 如果不存在，就说明是第一次设置
                let scale = 1;
                this.ele.style.marginLeft =  '0px';
                this.ele.style.marginTop  = '0px';
                this.ele.style.transform = 'translate(-50%, -50%) scale('+scale+','+scale+')';
            }
        },
        movePic: function(e,param){
            if(e.touches.length<=1){
                if(this.isScaleMode){
                    this.isScaleMode=false;
                    return;
                }
            }
            if(this.isScaleMode)return;
            if(param.is_endMove){ // 每次移动松开手指的时候要下次移动的基础坐标
              this.baseLeft = parseInt(this.ele.style.marginLeft.slice(0, -2));
              this.baseTop = parseInt(this.ele.style.marginTop.slice(0, -2));
            }else{
              let nodeStyle = this.ele.style.transform 
              if(nodeStyle){ // 有这个就表示应该是移动
                let currScaleSize = parseFloat(nodeStyle.slice(nodeStyle.indexOf('scale')+6))
                this.setMaxdisp(currScaleSize,this.baseLeft+ param.x, this.baseTop + param.y, 'move')
              }
            }
        },
        setMaxdisp:function(changeSize, changeX, changeY, type){
          // 计算最大位移
          // naturalWidth ： 是图片原始的宽度，通过比例可以计算出当前图片在页面的高度
          let picHeight =  this.bodyWidth  / (this.ele.naturalWidth / this.ele.naturalHeight); 
          let maxTop = ( picHeight * changeSize - window.innerHeight) /2 
          let maxLeft = this.bodyWidth / 2 * (changeSize - 1) 
          if(changeX >= maxLeft){
            this.ele.style.marginLeft = maxLeft + 'px'
          }else if(changeX < -maxLeft){
            this.ele.style.marginLeft = -maxLeft + 'px'
          }else if(type==='move'){
            this.ele.style.marginLeft =changeX +'px'; 
          }
          // 如果图片当前尺寸大于屏幕尺寸，可以移动
          if(maxTop > 0){
            if(changeY >= maxTop){
              this.ele.style.marginTop = maxTop + 'px';
            }else if(changeY < -maxTop){
              this.ele.style.marginTop = -maxTop + 'px'
            }else if(type==='move'){
              this.ele.style.marginTop = changeY+'px';
            }
          }else if(type==='move'){
            this.ele.style.marginTop = 0 +'px'; 
          }
        }
    },
    mounted: function () {
        let that = this;
        let url = that.$route.query.url;
        console.log('路由参数',that.$route.query);

        let history;
        if(history = localStorage.getItem('picture-history')){
            history = JSON.parse(history);
            if(history.url==url){
                console.log('使用图片历史');
                that.pictures = history.pictures;
                that.maxPictureIndex = that.pictures.length;
                return;
            }
        }


        let readHistory = JSON.parse(localStorage.getItem("read-history")) || {};

        if (+readHistory.chapterid == that.chapter.id) {
            that.currentPictureIndex = +readHistory.pictureIndex - 1;
        }

        that.$api
            .get("/page", {
                url: that.$route.query.url
            })
            .then(function (data) {
                console.log(data);
                if(!data||!data.images||!data.images.length)return;

                //保存结果
                localStorage.setItem('picture-history',JSON.stringify({url,pictures:data.images,updateTime:Date.now()}));

                that.pictures = data.images;
                that.maxPictureIndex = that.pictures.length;
                return;
                //that.pictures = data.pictures;
                //that.opus = data.opus;
                //that.chapter = data.chapter;
                //that.nextChapter = data.nextChapter;
                if (that.maxPictureIndex > 0) {
                    that.currentPictureUrl = that.pictures[that.currentPictureIndex].url + that.currentDefinition;
                    //记录阅读历史
                    that.recordHistory();
                }
            })
            .catch(that.$errorHandle);
    },
    components: {
        Actionsheet,
        HideNavBar,
        HeaderBar
    }
};
</script>

<style scoped lang="less">

.pic-view {
}

.controller-view {
    position: relative;
    background-color: red;

}

.menu {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3;

    .header-menu {
        height: 60px;
        line-height: 60px;
        overflow: hidden;
        pointer-events: none;
    }
    .definition-menu {
        position: absolute;
        top: 17px;
        right: 20px;
        padding: 5px 30px 5px 15px;
        border: 1px solid #fb7279;
        border-radius: 3px;
        pointer-events: all;
        background: url("../assets/image/arrow-bottom.png") 0 0 no-repeat;
        background-size: 11px;
        background-position: right 8px center;
        color: #fb7279;
        z-index: 3;
    }

    .mask {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: -1;
        background-image: linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0));
    }
}
.picture-img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
}
.img-area {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    text-align: center;
    z-index: 2;
    pointer-events: none;
    .picture-img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
    }
}
.animate-transition {
    transition: transform 0.3s;
}

.controller-area {
    position: fixed;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    text-align: center;
    z-index: 1;
}
.pret-area {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
}
.next-area {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 50vh;
    z-index: 3;
}
.menu-area {
    position: absolute;
    top: 20vh;
    left: 30vw;
    width: 40vw;
    height: 30vh;
    z-index: 4;
}
.page-tip {
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    text-shadow: 0 0 10px #000;
    pointer-events: none;
    z-index: 5;
}
.prompt-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9;
}
.continue-read-next-chapter {
    width: 100vw;
    height: 100vh;
    background: #000;
}
.readnext-btn {
    margin-top: 75vh;
    padding: 5px 25px;
    border: 1px solid #fb7279;
    border-radius: 4px;
    color: #fb7279;
}
.readnext-close-btn {
    position: absolute;
    top: 30px;
    left: 30px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    border: 1px solid #fb7279;
    border-radius: 100%;
    color: #fb7279;
    text-align: center;
}
</style>