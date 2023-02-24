export const extend = (...obj) => Object.assign(...obj);

export const isObject = target => typeof target === 'object';

export const typeAssert = target => {
  const s = Object.prototype.toString.call(target);
  const pattern = /\[\s*object (.*)\s*\]/;
  console.log('pattern.exec(s)', pattern.exec(s));
  return pattern.exec(s)[1];
};
