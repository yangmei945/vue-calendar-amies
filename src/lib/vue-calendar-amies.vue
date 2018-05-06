<template>
    <div>
        <div v-if="show" class="amies-wrap">
            <div class="amies-mask"></div>
            <div class="amies-content">
                <div class="amies-top">
                    <div class="amies-year">
                        <span class="amies-icon" @click="decYear">◀</span>
                        <span>{{year}}</span>
                        <span class="amies-icon" @click="addYear">▶</span>
                    </div>
                    <div class="amies-month">
                        <span class="amies-icon" @click="decMonth">◀</span>
                        <span>{{months[month]}}</span>
                        <span class="amies-icon" @click="addMonth">▶</span>
                    </div>
                </div>
                <table class="amies-date" cellpadding="0" cellspacing="0">
                    <tr>
                        <th>日</th>
                        <th>一</th>
                        <th>二</th>
                        <th>三</th>
                        <th>四</th>
                        <th>五</th>
                        <th>六</th>
                    </tr>
                    <tr v-for="(item, index) in [1, 2, 3, 4, 5, 6]" :key="index">
                        <td v-if="parseInt(idx/7)==index" v-for="(itm, idx) in currentMonth" :key="idx" :class="{'disable':idx<minDayIndex||idx>maxDayIndex||(year==endD.getFullYear()&&month==endD.getMonth()&&itm>endD.getDate())||(year==startD.getFullYear()&&month==startD.getMonth()&&itm<startD.getDate()),'chosed':idx>=minDayIndex&&idx<=maxDayIndex&&itm==day}" @click="chooseDate(itm, idx)">{{itm}}</td>
                    </tr>
                </table>
                <div class="amies-btns">
                    <span @click="close">取消</span>
                    <span @click="confirm">确定</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'vue-calendar-amies',
    props:{
        show:{
            type: Boolean,
            default: true
        },
        startDate: {
            type: String,
            default: "1900-1-1"
        },
        defaultDate: {
            type: String,
            default: new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()
        },
        endDate:{
            type: String,
            default: new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()
        }
    },
    data () {
        return {
            months: ["一","二","三","四","五","六","七","八","九","十","十一","十二"],
            weeks: ["日","一","二","三","四","五","六"],
            bigMonth: [0,2,4,6,7,9,11],
            startD: null,
            defaultD: null,
            endD: null,
            year: null,
            leapYear: false,
            month: null,
            day: null,
            week: null,
            currentMonth: [],
            minDayIndex: null,
            maxDayIndex: null
        }
    },
    mounted(){
        this.startD = new Date(this.startDate);
        this.defaultD = new Date(this.defaultDate);
        this.endD = new Date(this.endDate);
        this.init(this.defaultD);
    },
    methods:{
        init(date){
            this.year = date.getFullYear();
            this.month = date.getMonth();
            this.day = date.getDate();
            this.week = date.getDay();
            this.updateCalendar();
        },
        updateCalendar(){
            this.currentMonth = [];
            for(var i=this.day;i>0;i--){
                this.currentMonth.unshift(i);
            }
            var tempWeek = new Date(this.year+"-"+(this.month+1)+"-1").getDay();
            if(tempWeek>0){
                var lastDay = this.getLastDay((this.month-1), this.leapYear);
                for(var i=tempWeek;i>0;i--){
                    this.currentMonth.unshift(lastDay--);
                }
            }
            this.minDayIndex = this.currentMonth.indexOf(1);
            var tempDay = this.getLastDay(this.month, this.leapYear);
            for(var i=this.day+1;i<=tempDay;i++){
                this.currentMonth.push(i);
            }
            this.maxDayIndex = this.currentMonth.length-1;
            if(this.currentMonth.length<42){
                tempDay = 1;
                for(var i=this.currentMonth.length;i<=42;i++){
                    this.currentMonth.push(tempDay++);
                }
            }
        },
        getLastDay(month, leapYear){
            var tempDay = null;
            if(month==-1){
                tempDay = 31;
            }
            else if(month==1){
                if(leapYear){
                    tempDay = 29;
                }
                else{
                    tempDay = 28;
                }
            }
            else if(this.bigMonth.indexOf(month)!=-1){
                tempDay = 31;
            }
            else{
                tempDay = 30;
            }
            return tempDay;
        },
        decMonth(){
            if(this.year==this.startD.getFullYear()&&this.month<=this.startD.getMonth()){
                return;
            }
            this.month--;
            if(this.month==-1){
                this.month = 12;
                this.year--;
            }
            this.startDateCheck();
            this.week = new Date(this.year+"-"+(this.month+1)+"-"+this.day).getDay();
            this.updateCalendar();
        },
        addMonth(){
            if(this.year==this.endD.getFullYear()&&this.month>=this.endD.getMonth()){
                return;
            }
            this.month++;
            if(this.month==12){
                this.month = 0;
                this.year++;
            }
            this.endDateCheck();
            this.week = new Date(this.year+"-"+(this.month+1)+"-"+this.day).getDay();
            this.updateCalendar();
        },
        decYear(){
            if(this.year>this.startD.getFullYear()){
                this.year--;
                if(this.month<this.startD.getMonth()){
                    this.month = this.startD.getMonth();
                }
                this.startDateCheck();
                this.week = new Date(this.year+"-"+(this.month+1)+"-"+this.day).getDay();
                this.updateCalendar();
            }
        },
        addYear(){
            if(this.year<this.endD.getFullYear()){
                this.year++;
                if(this.month>this.endD.getMonth()){
                    this.month = this.endD.getMonth();
                }
                this.endDateCheck();
                this.week = new Date(this.year+"-"+(this.month+1)+"-"+this.day).getDay();
                this.updateCalendar();
            }
        },
        startDateCheck(){
            if(this.year==this.startD.getFullYear()&&this.month==this.startD.getMonth()&&this.day<this.startD.getDate()){
                this.day = this.startD.getDate();
            }
            else{
                this.day = this.defaultD.getDate();
            }
        },
        endDateCheck(){
            if(this.year==this.endD.getFullYear()&&this.month==this.endD.getMonth()&&this.day>this.endD.getDate()){
                this.day = this.endD.getDate();
            }
            else{
                this.day = this.defaultD.getDate();
            }
        },
        chooseDate(value, index){
            if(index>=this.minDayIndex&&index<=this.maxDayIndex){
                if(this.year==this.startD.getFullYear()&&this.month==this.startD.getMonth()&&value<this.startD.getDate()){
                    return;
                }
                if(this.year==this.endD.getFullYear()&&this.month==this.endD.getMonth()&&value>this.endD.getDate()){
                    return;
                }
                this.day = value;
            }
        },
        close(){
            this.$emit("closeCalendar");
        },
        confirm(){
            var date = this.year+"-"+(this.month>8?(this.month+1):'0'+(this.month+1))+"-"+(this.day>9?this.day:'0'+this.day);
            this.$emit("confirmCalendar", date);
            this.close();
        }
    },
    watch:{
        year(val){
            // 闰年：1、能整除4且不能整除100 2、能整除400
            if(val%100==0){
                if(val%400==0){
                    this.leapYear = true;
                }
            }
            else{
                if(val%4==0){
                    this.leapYear = true;
                }
            }
        }
    }
}
</script>

<style>
.amies-wrap{
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
}
.amies-mask{
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .4);
    position: absolute;
    top: 0;
    left: 0;
}
.amies-content{
    width: 270px;
    height: 290px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.amies-top{
    height: 40px;
    line-height: 40px;
    color: #69c;
    font-size: 9px;
}
.amies-year, .amies-month{
    display: inline-block;
    vertical-align: middle;
    width: 132px;
    text-align: center;
}
.amies-year span:nth-child(2), .amies-month  span:nth-child(2){
    display: inline-block;
    width: 60px;
    font-size: 14px;
}
.amies-date{
    margin: 0 auto;
}
.amies-date th, .amies-date td{
    width: 35px;
    height: 30px;
    text-align: center;
}
.amies-date th{
    font-size: 14px;
    color: #69c;
    box-sizing: border-box;
    border-bottom: 2px solid #69c;
}
.amies-date td{
    font-size: 12px;
    color: #333;
}
.amies-date td.disable{
    color: #888;
}
.amies-date td.chosed{
    color: #fff;
    background: #69c;
}
.amies-btns{
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #69c;
    text-align: right;
}
.amies-btns span{
    display: inline-block;
    margin-right: 30px;
}
</style>
