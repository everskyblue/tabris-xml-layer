
export function Bridge(ctx) {
  function FakeConstructor() {}
  FakeConstructor.prototype = new Proxy(ctx, {
    get(t, k){
      return t[k];
    },
    set(t, k, v){
      t[k] = v;
      return this;
    }
  });
  
  return new Proxy(FakeConstructor, {
    constructor: function (Construct) {
      return new Construct();
    }
  });
}