<template>
  <project-display :project-list="this.projectList" :key="key" @refresh="refreshProjectList"></project-display>
</template>

<script>
import ProjectDisplay from "@/components/ProjectDisplay.vue";
import {findProjectbyUserid} from "@/service/project.js";
import {getLocal} from "@/utils/local.js";
export default {
  name: 'MyProject',
  components: {ProjectDisplay},
  data () {
    return {
      userId: '',
      projectList: [],
      key: 0,
    }
  },
  mounted() {
    this.userId = getLocal("userId");
    if (!this.userId)
    {
      this.$notify({message:"请先登录", type:"warning"});
    }
    else
    {
      findProjectbyUserid({UserId: this.userId}).then(res => {
        this.projectList = res.data;
      })
    }
  },
  methods: {
    refreshProjectList() {
      this.key++;
    }
  }
}
</script>


<style scoped>
@import "../../assets/css/project/projectDisplay.scss";
</style>