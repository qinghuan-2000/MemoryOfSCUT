# SCUTMemory

## 接口文档



备注：从微信里面拿取信息、WeChatCode

### 获取首页轮播图

方法：Get

路由：

```http
/lunbo
```



输入：

requestParam: campusl类型为all、wushan、daxuecheng、guoji。  campus不可为空，keyword可为空(用于以后检索)

```json
"campus" :  "all"/"wushan"/"daxuecheng"/"guoji"

"keyword": 
```



返回值：

```json
{
    "status": 200,
    "msg":  "OK",
    "data": [
                {

                ​	"title": string

                ​	"author":string

                ​	"dateTime":date

                ​	"campus":string

                ​	"resource":["img1"]

                ​	"type":img/video

                ​	"description":string

                ​	"userIcon"：string

                }

            ]
}


```

说明：

​	userIcon 用户头像地址。resource为图片id。





### 获取背景音乐

方法：Get

路由：/music

输入:  null 

返回值:  active与inactive分别对应两种背景音乐，其中，active正常操作时候的音乐，inactive为轮播图片时候的音乐。

```json
{
    "status":200,
    "msg":"OK",
    "data":{

            ​	"active": string,

            ​	"inactive":string

			}
}


```

说明： 背景音乐可以直接走nginx代理，后端现在是直接写死音乐获取（

### 获取老照片列表

方法：Get

路由：

```http
/vphotoList
```

输入:  

keyword (用于以后检索) 可为空

offset 用于为分页的偏移量，第几页

limit 用于获取分页的个数



```json
"keyword":
"offset": Integer
"limit": Integer
```

返回值:

```json
{
    "status":200,
    "msg":"OK",
    "data":[

                {

                ​	"title": string

                ​	"author":string

                ​	"dateTime":date

                ​	"campus":string

                ​	"resource":["img1"]

                ​	"type":img

                ​	"description":string

                ​	"userIcon":  string

				}

			]
}
```



### 获取短视频列表

方法：Get

路由：

```http
/vclipList
```

输入:  

keyword (用于以后检索) 可为空

offset 用于为分页的偏移量，第几页

limit 用于获取分页的个数



```json
"keyword":
"offset": Integer
"limit": Integer
```



返回值:

```json
{
    "status":200,
    "msg":"OK",
    "data":[

                {

                ​	"title": string

                ​	"author":string

                ​	"dateTime":date

                ​	"campus":string

                ​	"resource":["img1"]

                ​	"type":video

                ​	"description":string

                ​	"userIcon":  string

				}

			]
}
```



### 获取视觉符号列表

方法：Get

路由：

```http
/viconList
```

输入:   

keyword (用于以后检索) 可为空

offset 用于为分页的偏移量，第几页

limit 用于获取分页的个数

```json
"keyword":
"offset": Integer
"limit": Integer
```

返回值:

```json
{
    "status" :200,
    "msg":"OK",
    "data": [
            {

            ​	"title": string

            ​	"author":string

            ​	"dateTime":date

            ​	"campus":string

            ​	"resource":["img1"]  

            ​	"type":img/video

            ​	"description":string

            ​	"userIcon":  string

            ​	"htmlPage":string
    		

            }
		]
}


```



//略去！直接nginx转发。

### 视觉符号详情

方法：Get

路由：htmlPage为文件地址

```http
/viconDetail/{htmlPage}   
```

输入:  none

返回值:

```
html/text
```



### 获取图片长宽以及压缩

方法:Get

路由：

```http
/disposeImg/{imgUrl}
```

输入: requestParam 输入图片的宽高，然后获取图片

```json
"width" : string
"height" : string
```



返回值：

```json
{
    "status":200,
    "msg":"OK",
    "data":["img"]
}
```





### 艺术创作列表

方法：Get

路由：/paintingList

输入: keyword (用于以后检索) 可为空

offset 用于为分页的偏移量，第几页

limit 用于获取分页的个数

```json
"keyword":
"offset": Integer
"limit": Integer
```

返回值:

注意，后端限制只能够放一个视频

```json
{
    "status":200,
    "msg":"OK",
    "data":[{

            ​	"title": string

            ​	"author":string

            ​	"dateTime":date

            ​	"campus":string

            ​	"resource":["img1","img2"]

            ​	"type":img/video

            ​	"description":string

            ​	"userIcon":  string
            }
			]
}

```





### 时光格子/随机(短视频、图片)

方法：Get

路由：/timeBox/random

输入 (参数）: 

类型: requestParam

```json
"startAt": date (null)

"endAt":date (null)

"top":int (top最多个数，可为空,default : 6)

"keyword": (检索功能,可为空)
```



返回值:(随机返回、算法)

```json
{
    "status":200,
    "msg":"OK",
    "data": [{

        ​	"title": string

        ​	"author":string

        ​	"dateTime":date

        ​	"campus":string

        ​	"resource":string

        ​	"type":img/video

        ​	"description":string

        ​	"userIcon":  string

}]
}



```





### 成员列表

说明：先看是否是top，top按照时间排序，非top再按照时间排序。

方法：Get

路由：/member

输入 (参数）:  null

```json

```



返回值: 直接返回所有成员的参数值

```json
{
    "status":200,
    "msg":"OK",
    "data":[{
        "name":String,              //名称
        "contribution": String,     //贡献
        "yearOfEnroll": String,    //入学年份
        "major": String,         //专业
        "description": String,  //华园记忆的看法
        "userIcon": String,  //用户头像
        "startAt": Date,  //进入团队时间
        "endAt": Date,     //离开团队时间
        "top": Integer     //是否放到最前面
    }]
}
```









## //此为另外一套系统！----------------------

### 图片上传

方法: Post

路由： /uploadImg

输入参数：

requestParam / formdata

```json
"file": 文件
"author" : string 作者
"description" : string 描述
"width" : Interger 图片宽
"height" Integer 图片高
```



返回值：

```json
{
    "status":200,
    "msg": "OK",
    "data": {
        
    }
}
```





### 申请人信息上传接口

方法:Post

路由： /createMember

输入参数:

requestBody

```json
"name" : String
"yearOfEnroll" : String
"description" : String
"phone" : String
```



返回值：

```json
{
    "status":200,
    "msg": "OK",
    "data": {
        
    }
}
```







## //-----------------------------







## 数据库表

### Angle

数据库返回最晚七张图片（轮播图）

| 表名        | angle  |         |                        |
| ----------- | ------ | ------- | ---------------------- |
| 属性        | 类型   | 空?     | 描述                   |
| title       | string | null    |                        |
| author      | string | null    |                        |
| dateTime    | date   | null    |                        |
| campus      | string | null    |                        |
| resource    | string | null    |                        |
| type        | string | null    | img/video              |
| unionid     | string | notNull | 该图片投稿人的微信code |
| id          | string | notNull | 主键id                 |
| state       | int    | notNull | 表示是否删除，默认为1  |
| description | string | null    | 描述                   |



### VResource(视觉资源)

| 表名       | vresource |         |                                                              |
| ---------- | --------- | ------- | ------------------------------------------------------------ |
| 属性       | 类型      | 空？    | 描述                                                         |
| title      | string    | null    |                                                              |
| author     | string    | null    |                                                              |
| dateTime   | date      | null    |                                                              |
| campus     | string    | null    |                                                              |
| resource   | string    | null    | ["img1"]                                                     |
| type       | string    | null    | img/video                                                    |
| unionid    | string    | notNull | 该图片投稿人的微信code                                       |
| id         | string    | notNull | 主键id                                                       |
| state      | int       | notNull | 表示是否删除,默认为1                                         |
| chooseWeb  | string    | notNull | 判断属于哪个页面, clipList（短视频列表)<br />                                 visualSign(视觉符号列表)<br />                                 artList(艺术创作列表) |
| desciption | string    | null    | 描述                                                         |
| htmlPage   | string    | null    | 如果是视觉符号列表，则可以返回htmlPage                       |
| width      | Integer   | null    | 暂时先不用                                                   |
| height     | Integer   | null    | 暂时先不用                                                   |
| createAt   | date      | null    | 创建时间精确到秒 (已经包含此字段，dateTime，createAt略去)    |
| top        | Integer   | null    | 1:   如果1为置顶， default: "0"                              |





### member (成员列表)



| 属性         | 类型   | 空       | 描述                                |
| ------------ | ------ | -------- | ----------------------------------- |
| name         | string | null     | 名称                                |
| contribution | string |          | 贡献                                |
| yearOfEnroll | string |          | 入学年份                            |
| major        | string |          | 专业                                |
| description  | string |          | 华园记忆看法                        |
| userIcon     | string |          | 头像地址                            |
| id           | string | not null | 主键id                              |
| startAt      | date   |          | 进入团队时间，月                    |
| endAt        | date   | null     | 如果为空，则为至今                  |
| top          | int    |          | 1: 代表排在最前面 置顶，default:"0" |
|              |        |          |                                     |



### Applicant(申请人)



| 属性         | 类型   | 空      | 描述           |
| ------------ | ------ | ------- | -------------- |
| name         | string | notNull | 申请人姓名     |
| yearOfEnroll | string | notNull | 申请人年级     |
| description  | string | notNull | 申请人个人描述 |
| phone        | string | notNull | 申请人电话号码 |
| id           | string | notNull | 主键id         |
|              |        |         |                |
|              |        |         |                |
|              |        |         |                |
|              |        |         |                |

