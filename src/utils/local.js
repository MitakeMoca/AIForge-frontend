//保存在前端本地账号等配对信息

//通过key获得value
export const getLocal = (name) => {
    return localStorage.getItem(name)
}

//设置key和value的配队
export const setLocal = (name, value) => {
    localStorage.setItem(name, value)
}