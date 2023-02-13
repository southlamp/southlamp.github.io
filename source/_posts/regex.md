---
title: regex
date: 2023-02-13 17:06:24
tags:
---

### 测试正则在部分浏览器兼容性
<script>
const pattern =
  /^[\u3400-\u4DB5\u4E00-\u9FA5\uF900-\uFAD9\u{2A700}-\u{2B738}\u{2B820}-\u{2CEA1}]+(\u00b7?[\u3400-\u4DB5\u4E00-\u9FA5\uF900-\uFAD9\u{2A700}-\u{2B738}\u{2B820}-\u{2CEA1}]+)*$/u;
  console.log('pattern', pattern)
  const name = '张三䶮'
  console.log('name', name)
  window.alert(pattern.test(name))
</script>

