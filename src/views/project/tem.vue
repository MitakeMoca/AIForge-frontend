async mounted() { console.log(output->mounted); this.userId =
getLocal('userId'); await getUser({ UserId: this.userId }).then((res) => {
this.vipLevel = res.data.level; }); await
findModelByUserId(this.userId).then((res) => { this.personalModels = res.data;
}); if (this.$route.params.id) { this.projectId = Number(this.$route.params.id);
await getProject({ ProjectId: this.projectId }).then( async (res) => { if (res
!= null) { let data = res.data; if (data.projectType) { this.form.ProjectType =
data.projectType; getModelsByProjectType(data.projectType).then( (res) => {
this.models = res.data; }, ); this.currentStep = 1; } if (data.modelId !== -1) {
await findModelById(data.modelId).then((model) => { this.form.model =
model.data; }); await getParamsByModelId( this.form.model.modelId,
).then((param) => { this.hyperparameters = param.data; }); this.currentStep = 2;
} if (data.train_DatasetId !== -1) { await findDatasetById({ DatasetId:
Number(data.train_DatasetId), }).then((dataset) => { if (dataset.data !== null)
{ this.form.dataset.push(dataset.data); dataset.data.selected = true;
this.datasetSelectedCount++; this.form.trainSet = dataset.data; this.currentStep
= 2; } }); } if (data.test_DatasetId !== -1) { await findDatasetById({
DatasetId: Number(data.test_DatasetId), }).then((dataset) => { if (dataset.data)
{ this.form.dataset.push(dataset.data); dataset.data.selected = true;
this.datasetSelectedCount++; this.form.testSet = dataset.data; this.currentStep
= 2; } }); } await getHyparaByProjectId({ ProjectId: this.projectId,
}).then((res) => { let path = res.data[res.data.length - 1]; if (path) {
findHyparaByPath({ StorePath: path }).then( (params) => { this.form.params =
params.data; }, ); this.currentStep = 3; } }); } },
