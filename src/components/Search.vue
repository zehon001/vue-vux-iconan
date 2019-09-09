<template>
    <div v-test-directive class="search-view">
        <hide-nav-bar></hide-nav-bar>
        <header-bar></header-bar>
        <div class="search-title">
            <h1 class="title-content">搜索结果</h1>
        </div>
        <div class="search-body">
            <ul class="search-content" :style="{ top }">
                <li class="search-item" :result="o" v-for="(o, index) in results" :key="index" @click="onItemClick(o)">
                    <img class="icon" :src="o.src"/>
                    <div class="desc">
                        <h1 class="title">{{o.title}}</h1>
                        <div class="type">{{o.info}}</div>
                        <div class="updateTime">{{o.updateTime}}</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { Tab, TabItem, Flexbox, FlexboxItem, Rater } from "vux";
import HideNavBar from "@/components/common/HideNavBar";
import HeaderBar from "@/components/common/HeaderBar";
import Vue from "vue";



export default {
    name: "Search",
    data() {
        // return {
            
        //     results:[
        //         {
        //             src:"http://img.94201314.net/comicui/23059.JPG",
        //             title:'进击的巨人[120]',
        //             info:"类型：冒险 作者：諫山创",
        //             url:"http://99770.hhxxee.com/comic/6643",
        //             updateTime:"最后更新:  于 2018-10-02 01:07",
        //         }
        //     ],
        // };
        return {
            results:[]
        };
    },
    methods: {
        onItemClick: function (info) {
            console.log('点击',info);
            this.$router.push({
                    path: "/opus?url="+info.url+"&info="+info.info+"&src="+info.src,
            });
            //this.$router.push("/opus/" + url);
        }
    },
    mounted: function () {
        let that = this;
        console.log('路由参数',that.$route.params);
        that.$api.get('/search',{
            content:that.$route.params.content
        })
        .then(function(data){
            console.log(data);
            if(!data||!data.length){
                Vue.prototype.instance.$vux.toast.show("暂无搜索结果！");
                return;
            }
            //console.info(data);
            data.map((d)=>{
                let info = "";
                d.info.map((i)=>{
                    info += i +" ";
                })
                d.info = info;
            });
            that.results = data;
            
        })
        .catch(that.$errorHandle);;
    },
    components: {
        Tab,
        TabItem,
        HideNavBar,
        HeaderBar,
        Flexbox,
        FlexboxItem,
        Rater
    }
};
</script>

<style scoped lang="less">

.search-view {
    position: relative;
    width: 100%;
    height: 100%;
}
.search-body {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;

}
.search-title {
    top: 0;
    left: 0;
    position: fixed;
    background-color: white;
    border-bottom: 2px solid #efefef;
    width: 100%;
    height: 52px;
    .title-content{
        padding: 11px;
        color: #474747;
        text-align: center;
        font-size: 20px;
    }
}


.search-content{
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    margin-top: 60px;
    background-color: #efefef;
    
    .search-item{
        display:flex;
        height: 70px;
        width: 100%;
        border-bottom: 2px solid #efefef;
        align-items: center;
        justify-content: flex-start;
        background-color: white;

        .icon{
            height:100%;
        }
        .desc{
            width: 100%;
            height: 100%;
            align-items: center;
            justify-content: flex-start;
            margin-left: 10px;
            .title{
                border: none;
                color: black;
                font-size: 15px;
            }
            .type{
                border: none;
                color: black;
                font-size: 10px;
            }
            .updateTime{
                border: none;
                color: black;
                font-size: 10px;
            }
        }
    }
}


</style>