---
title: regex1
date: 2023-02-13 17:43:51
tags:
---


### 测试正则在部分浏览器兼容性(兼容版)
<script>
const pattern0 =
  /^(?:[\u3400-\u4DB5\u4E00-\u9FA5\uF900-\uFAD9]|\uD869[\uDF00-\uDFFF]|[\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD86D[\uDC00-\uDF38]|\uD86E[\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1])+(\xB7?(?:[\u3400-\u4DB5\u4E00-\u9FA5\uF900-\uFAD9]|\uD869[\uDF00-\uDFFF]|[\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD86D[\uDC00-\uDF38]|\uD86E[\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1])+)*$/;
  console.log('pattern0', pattern0)
  const name0 = '张三䶮'
  console.log('name0', name0)
  window.alert(pattern0.test(name0))
</script>
