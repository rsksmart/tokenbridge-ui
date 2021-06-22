<template>
    <div id="success" class="mt-3 align-center text-center alert alert-dismissible fade show" style="display:none;">
        <div class="outline-rounded">
            <div style="font-size: 32px;"><i class="fas fa-check"></i></div>
            <div>You will receive <span id="receive" class="black">126 rKovDAI</span> in your wallet in aproximately <span id="confirmationTime">X minutes</span></div>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    </div>
</template>
<script>
export default {
  name: 'SuccessMsg'
}
</script>
