<template>
  <div class="row mb-3 justify-content-center">
      <div class="col-5 row">
        <div class="col-8 font-weight-bold">
          <a href="{{ token.link }}" class="address" target="_blank">
            <span><img src="{{token.icon}}" class="token-logo"></span>
            { token.symbol }}
          </a>
         </div>
         <div class="col-4">
           <button class="copy btn btn-outline-secondary" type="button" data-clipboard-text="{{token.address | toLowerCase }}" data-toggle="tooltip" data-placement="bottom" title="Copy token address to clipboard">
                  <i class="far fa-copy"></i>
             </button>
         </div>
      </div>
      <div class="col-2 text-center">
          <i class="fas fa-arrows-alt-h"></i>
      </div>
      <div class="col-5 row">
        <div class="col-8 font-weight-bold">
            <a href="${rskConfig.crossToNetwork.explorer}/address/${aToken[rskConfig.crossToNetwork.networkId].address.toLowerCase()}" class="address" target="_blank">
              <span><img src="{{ token.icon }}" class="token-logo"></span>{{ token.symbol }}
            </a>
        </div>
        <div class="col-4">
          <button class="copy btn btn-outline-secondary" type="button" data-clipboard-text="{{ token.crossAddress | toLowerCase }}" data-toggle="tooltip" data-placement="bottom" title="Copy the address">
                <i class="far fa-copy"></i>
            </button>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  name: 'TokenRow',
  props: {
    token: {
      type: Object,
      required: true
    }
  }
}
</script>
