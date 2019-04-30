
<template src="./tree.html"></template>
<style src="./tree.css"></style>


<script>
var header = {
        template: '<h1>头部内容</h1>'
    }

    var left = {
        template: '<h1>左侧内容</h1>'
    }

    var mainBox = {
        template: '<h1>主要内容</h1>'
    }



    var router = new VueRouter({
        routes:[
            {path: '/', components: {
                'default': header,
                'left': left,
                'mainBox': mainBox,
            }
            }
        ]
    })


    var app1 = new Vue({
        el: '#container',
        data:{
            list:[1,3,4]
        },
        router



    })

</script>
