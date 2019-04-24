<template>
    <div class="vfc-months-container">
        <div class="vfc-navigation-buttons" v-if="true">
            <div @click="PreYear">
                <div class="vfc-arrow-left"></div>
            </div>
            <h2 class="vfc-top-date"
                @click="openYearPicker"
                :class="{'vfc-underline': !showYearPicker && fConfigs.changeYearFunction}">{{
                calendar.currentDate.getFullYear() }}</h2>
            <div @click="NextYear">
                <div class="vfc-arrow-right"></div>
            </div>
        </div>
        <div class="vfc-months">
            <template v-if="!showYearPicker">
                <div class="vfc-item" v-for="(month,key) in fConfigs.monthNames"
                     :key="key"
                     :class="{'vfc-selected': calendar.currentDate.getMonth()===key}"
                     @click="pickMonth(key)">
                    {{ month }}
                </div>
            </template>
            <template v-else>
                <div class="vfc-item"
                     v-for="(year,key) in yearList"
                     :key="key"
                     :class="{'vfc-selected': year.selected}"
                     @click="pickYear(year.year)">
                    {{ year.year }}
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MonthPicker"
    }
</script>

<style scoped>

</style>