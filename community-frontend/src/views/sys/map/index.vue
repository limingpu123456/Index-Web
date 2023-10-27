<template>
  <div class="app-container">
    <baidu-map class="bm-view" :center="center" :zoom="zoom" @ready="initMap">
      <!-- 定位 -->
      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :show-address-bar="true" :auto-location="true" />
      <!-- 城市列表 -->
      <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT" />
      <!-- 缩放工具 -->
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <!-- 视图切换 -->
      <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
      <!-- 标注 -->
      <bm-marker
        v-for="(item, index) in mapData"
        :key="index"
        :position="{lng: item.lng, lat: item.lat}"
        :clicking="false"
        animation="BMAP_ANIMATION_BOUNCE"
      >
        <!-- 显示小区名称 -->
        <bm-label :content="item.communityName" :label-style="{color: 'red', fontSize : '9px'}" :offset="{width: -25, height: 20}" />
      </bm-marker>
    </baidu-map>
  </div>
</template>

<script>
import { getCommunityMap } from '@/api/sys/community'
export default {
  name: 'Map',
  data() {
    return {
      listQuery: {
        gradeId: ''
      },
      center: {
        lng: 116.3755,
        lat: 39.80896
      },
      zoom: 12,
      mapData: []
    }
  },
  mounted() {
  },
  methods: {
    initMap({ BMap, map }) {
      this.center.lng = 116.4146
      this.center.lat = 40.11316
      map.enableScrollWheelZoom()
      map.enableKeyboard()
      map.enableDoubleClickZoom()
      getCommunityMap().then(res => {
        this.mapData = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .bm-view {
    width: 100%;
    height: 620px;
  }
</style>
