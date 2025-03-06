<template>
  <header class="upperbar">
    <upperbar/>
  </header>
  <aside class="sidebar" style="padding-top: 60px;">
    <sidebar/>
  </aside>
  <div class="project">
    <div class="project-top">
      <h1 style="margin: 30px;font-size: 40px">我的项目</h1>
      <create-icon class="create-project-button" @click="createDialog = true"></create-icon>
<!--      <span >创建项目</span>-->
      <el-dialog
          v-model="createDialog">
        <div>
          <label>
            <span style="font-size: 20px;">
              项目名称
              <span style="color: darkred">*</span>
            </span>
          </label>
          <input
              v-model="projectName"
              type="text"
              class="input"
              placeholder="项目名称请输入不超过15个字符"
              style="font-size: 20px;"
          />
          <br>
          <label>
            <span style="font-size: 20px;">
              项目简介
            </span>
          </label>
          <input
              v-model="projectDescription"
              type="text"
              class="input"
              style="font-size: 20px;"
          />
        </div>
        <br><br>
        <span slot="footer">
          <el-button size="large" @click="createDialog = false">取消</el-button>
          <el-button size="large" type="primary" @click="goCreate()">确定</el-button>
        </span>

      </el-dialog>
    </div>
<!--    <div class="project-middle">-->
<!--      <span class="item" :class="{active: this.show === 'myCreate'}" @click="showMyProject()">-->
<!--        我的项目-->
<!--      </span>-->
<!--      <span class="item" :class="{active: this.show === 'myCollect'}" @click="showMyCollect()">-->
<!--        我的收藏-->
<!--      </span>-->
<!--    </div>-->
    <div class="separator"></div>
    <div class="project-body">
      <router-view></router-view>
    </div>

  </div>


</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import Upperbar from '@/components/Upperbar.vue';
import {getLocal} from "@/utils/local.js";
import {createProject} from "@/service/project.js";
import CreateDialog from "@/components/CreateDialog.vue";
import CreateIcon from "@/assets/icon/CreateIcon.vue";

export default {
  name: 'Project',
  data() {
    return {
      userId: '',
      createDialog: false,
      show: 'myCreate',
      projectName: '',
      projectDescription: '',
    }
  },
  mounted()
  {
    this.userId = getLocal('userId');
  },
  methods: {
    showMyProject() {
      this.show = "myCreate";
      this.$router.push('/project/myProject');
    },
    showMyCollect() {
      this.show = "myCollect";
      this.$router.push('/project/myCollect');
    },
    formatDateTime(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    goCreate() {
      if (this.projectName !== '' && this.projectName.length <= 15) {
        let jsonData = {
          ProjectName: this.projectName,
          Description: this.projectDescription,
          UserId: this.userId,
          CreateTime: this.formatDateTime(new Date()),
          modelId: -1,
          Train_DatasetId: -1,
          Test_DatasetId: -1,
          ImageId: -1,
          ProjectType: ''
        };
        createProject(jsonData).then(res => {
          this.$router.push({path: `/project/projectConfig/${res.data.projectId}`});
        });
        this.createDialog = false;

      }
      else {
        this.$notify({message: '请输入合法项目名称', type: "warning"})
      }
    }
  },

  components: {
    CreateIcon,
    CreateDialog,
    Sidebar,
    Upperbar
  }
}
</script>

<style scoped>
@import "../../assets/css/project/project.scss";
@import '../../assets/css/components/Bar.scss';
</style>