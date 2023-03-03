// 将 add-foo -> addFoo 写法，使用replace替换
export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, g1) => g1 && g1.toUpperCase());
};

// 将首字母变为大写
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
// 加上事件标识
export const toHandlerKey = (str: string) => {
  return str ? 'on' + capitalize(str) : '';
};