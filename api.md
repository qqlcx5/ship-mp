https://www.anahaimu.store/api/products?sid=0&keyword=&priceOrder=&salesOrder=&news=0&page=1&limit=20&cid=1&coupon_category_id=&productId=(商品列表)


idint001编号
namevarchar2550参数名称
sortint0排序
add_timeint00添加时间
is_delintO0是否删除
statusint0参数状态
collatorvarchar500整理人
view_numintn0虚拟浏览量
cate _idintn□取件分类
imagevarchar200n0封面图片
desc_file_urlvarchar2000说明附件url
desc_file_namevarchar2000附件名称

https://www.anahaimu.store/api/category（商品分类  这个有返回子类 不用管他 只输出一级分类就好）
https://www.anahaimu.store/api/v2/pickitem/info?id=6&group_field=part_name（取件详情，group_field取值 part_name-部位，plate_part_no-板件）
https://www.anahaimu.store/api/v2/pickitemcate/getall  取件分类
https://www.anahaimu.store/api/v2/pickitem/getlist?cate_id=35（取件列表）
联调上面的接口