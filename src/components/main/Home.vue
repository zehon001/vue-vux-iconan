<template>
    <div>
        <div class="box_search" >
            <input class="input_search" type="text" placeholder="请输入要搜索的内容" v-model="search_content">
            <button class="btn_search" type="button" @click="search"> 搜索</button>
        </div>
        <swiper :list="swiperList" auto loop :aspect-ratio="350/750" @click="goto"></swiper>
        <recommend :opus="o" v-for="(o, index) in opuses" :key="index"></recommend>
    </div>
</template>

<script>
import { Swiper, SwiperItem } from "vux";
import Recommend from "@/components/main/home/Recommend";
import Vue from "vue"

export default {
    name: "Home",
    data() {
        return {
            search_content:"",
            swiperList: [],
            opuses: []
        };
    },
    methods: {
        goto: function (type, id) {
            console.info(arguments);
        },
        search:function(content){
            if(!this.search_content){
                Vue.prototype.instance.$vux.toast.show("请输入搜索内容！");
            }else{
                this.$router.push("/search/" + this.search_content);
            }

        },
    },
    components: {
        Swiper,
        SwiperItem,
        Recommend
    },
    mounted: function () {
        return;
        let that = this;
        that.$api
            .get("/home")
            .then(function (data) {
                console.info(data);
                that.swiperList = data.swiperList;
                that.opuses = data.opuses;
            })
            .catch(that.$errorHandle);

        if (localStorage.getItem("read-history")) {
            that.$popup.show();
        }
    }
};
</script>

<style scoped>

.box_search {
    display: flex;
    height: 70px;
    align-items: center; /*定义body的元素垂直居中*/
    justify-content: center; /*定义body的里的元素水平居中*/
    background: #555;
}

.input_search {
    width: 50%;
    height: 24px;
    border-radius: 5px;

}
.btn_search {

    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 5px 24px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin-left: 10px;
    border-radius: 5px;
    
}



</style>