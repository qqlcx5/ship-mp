# 联调接口文档（已整理）

## 1. 商品列表
**GET** `https://www.anahaimu.store/api/products`

| 参数            | 类型   | 必填 | 说明                  |
|-----------------|--------|------|-----------------------|
| sid             | int    | 否   | 店铺 ID（默认 0）     |
| keyword         | string | 否   | 搜索关键字             |
| priceOrder      | string | 否   | 价格排序 asc / desc   |
| salesOrder      | string | 否   | 销量排序 asc / desc   |
| news            | int    | 否   | 是否新品 1=是 0=否    |
| page            | int    | 否   | 页码（默认 1）        |
| limit           | int    | 否   | 每页条数（默认 20）   |
| cid             | int    | 否   | 分类 ID               |
| coupon_category_id | string | 否 | 优惠券分类 ID         |
| productId       | string | 否   | 指定商品 ID（多个用英文逗号分隔） |


---

## 2. 商品一级分类
**GET** `https://www.anahaimu.store/api/category`
> 只返回一级分类，子类忽略。

---

## 3. 取件详情
**GET** `https://www.anahaimu.store/api/v2/pickitem/info`

| 参数         | 类型   | 必填 | 说明                                |
|--------------|--------|------|-------------------------------------|
| id           | int    | 是   | 取件 ID                             |
| group_field  | string | 是   | 分组字段：part_name（部位） / plate_part_no（板件） |

---
### 返回字段
| 字段           | 类型   | 说明               |
|----------------|--------|--------------------|
| id             | int    | 商品编号           |
| name           | string | 商品名称           |
| sort           | int    | 排序值             |
| add_time       | int    | 添加时间戳         |
| is_del         | int    | 是否删除 1=是 0=否 |
| status         | int    | 状态 1=上架 0=下架 |
| collator       | string | 整理人             |
| view_num       | int    | 虚拟浏览量         |
| cate_id        | int    | 取件分类 ID        |
| image          | string | 封面图片 URL       |
| desc_file_url  | string | 说明附件 URL       |
| desc_file_name | string | 附件名称           |


## 4. 取件分类（全量）
**GET** `https://www.anahaimu.store/api/v2/pickitemcate/getall`

---

## 5. 取件列表
**GET** `https://www.anahaimu.store/api/v2/pickitem/getlist`

| 参数    | 类型 | 必填 | 说明         |
|---------|------|------|--------------|
| cate_id | int  | 是   | 取件分类 ID  |
返回
{
  "status": 200,
  "msg": "success",
  "data": {
    "total": 1,
    "list": [
      {
        "id": 12,
        "name": "111",                 // 名称
        "sort": 0,
        "add_time": "2025-09-08 22:41:20",
        "is_del": 0,
        "status": 1,
        "collator": "222",             // 整理人
        "view_num": 0,                 // 浏览量
        "cate_id": 35,
        "image": "http://local.crmeb.com/uploads/attach/2025/02/20250224/6db73c9e06d9cbc0c710dd9fdf4aabde.png",  // 封面图片
        "desc_file_url": "https://www.anahaimu.store/uploads/attach/2025/09/20250909/72eb30dcd3f277e8d622a0888c79a27c.doc", // 附件地址
        "desc_file_name": "新建 DOC 文档.doc" // 附件名称
      }
    ]
  }
}

商品详情
https://www.anahaimu.store/api/product/detail/5（商品详情 只考虑单sku ）
取值 ：
{
  "status": 200,
  "msg": "success",
  "data": {
    storeInfo: {
      "id": 5,
      "name": "111",
      "sort": 0,
      "add_time": "2025-09-08 22:41:20",
      "is_del": 0,
      "status": 1,
      "collator": "222",
      "view_num": 0,
      "cate_id": 35,
      "image": "http://local.crmeb.com/uploads/attach/2025/02/20250224/6db73c9e06d9cbc0c710dd9fdf4aabde.png",
      "desc_file_url": "https://www.anahaimu.store/uploads/attach/2025/09/20250909/72eb30dcd3f277e8d622a0888c79a27c.doc",
      "desc_file_name": "新建 DOC 文档.doc",
      "price": 9900
    }
  }
}


伪造请求头
可用下面的token
请求头加
authori-zation: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwd2QiOiJkNDFkOGNkOThmMDBiMjA0ZTk4MDA5OThlY2Y4NDI3ZSIsImlzcyI6Ind3dy5hbmFoYWltdS5zdG9yZSIsImF1ZCI6Ind3dy5hbmFoYWltdS5zdG9yZSIsImlhdCI6MTc1NzczMzU5MCwibmJmIjoxNzU3NzMzNTkwLCJleHAiOjE3NjAzMjU1OTAsImp0aSI6eyJpZCI6MywidHlwZSI6ImFwaSJ9fQ.aZSOW5E8Y5oG5EeyefBPJ89YolCSTfPeVjbf2uAyU_I

地址列表（需要登录）
https://www.anahaimu.store/api/address/list?page=1&limit=20

地址省市区
https://www.anahaimu.store/api/city_list

地址新增、编辑
https://www.anahaimu.store/api/address/edit
新增

编辑

地址删除
https://www.anahaimu.store/api/address/del


地址设置默认
https://www.anahaimu.store/api/address/default/set
