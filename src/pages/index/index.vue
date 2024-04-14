<script setup lang="ts">
import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'
import CustomNavbar from './components/CustomNavbar.vue'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'
import type { XtxGuessInstance } from '@/types/component'

// 轮播图
const bannerList = ref<BannerItem[]>([])
const getBannerData = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}

// 首页分类
const categoryList = ref<CategoryItem[]>([])
const getCategoryData = async () => {
  const res = await getHomeCategoryAPI()
  categoryList.value = res.result
}

// 热门推荐
const hotList = ref<HotItem[]>([])
const getHomeHotData = async () => {
  const res = await getHomeHotAPI()
  hotList.value = res.result
}

const guess = ref<XtxGuessInstance>()
const onScrolltolower = () => {
  guess.value?.getMore()
}

const triggered = ref(false)
const onRefresherrefresh = async () => {
  triggered.value = true
  // 清空数据再重新加载
  guess.value?.clearData()
  await Promise.all([getBannerData(), getCategoryData(), getHomeHotData()])
  triggered.value = false
}

onLoad(() => {
  getBannerData()
  getCategoryData()
  getHomeHotData()
})
</script>

<template>
  <CustomNavbar />
  <scroll-view
    scroll-y
    class="scroll-view"
    refresher-enabled
    :refresher-triggered="triggered"
    @scrolltolower="onScrolltolower"
    @refresherrefresh="onRefresherrefresh"
  >
    <XtxSwiper :list="bannerList" />
    <CategoryPanel :list="categoryList" />
    <HotPanel :list="hotList" />
    <XtxGuess ref="guess" />
  </scroll-view>
</template>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.scroll-view {
  flex: 1;
}
</style>
