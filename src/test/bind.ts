
export function MBind(self, ...param) {
  const _this = this;
  return (...arg) => {
    _this.call(self, ...param, ...arg);
  };
}
