<template>
    <div id="wait" class="mt-3 align-center text-center" style="max-width:350px; line-height: 16px; display:none;">
        <!-- Spinner <div class="spinner-border mb-4" style="height:70px; width:70px"></div> -->
        <!-- https://tobiasahlin.com/spinkit/ -->
        <div class="sk-fading-circle">
            <div class="sk-circle1 sk-circle"></div>
            <div class="sk-circle2 sk-circle"></div>
            <div class="sk-circle3 sk-circle"></div>
            <div class="sk-circle4 sk-circle"></div>
            <div class="sk-circle5 sk-circle"></div>
            <div class="sk-circle6 sk-circle"></div>
            <div class="sk-circle7 sk-circle"></div>
            <div class="sk-circle8 sk-circle"></div>
            <div class="sk-circle9 sk-circle"></div>
            <div class="sk-circle10 sk-circle"></div>
            <div class="sk-circle11 sk-circle"></div>
            <div class="sk-circle12 sk-circle"></div>
        </div>
        <div class="mt-2">
            Wait for aproximately <b><span id="secondsPerBlock">X</span> seconds:</b> 
            the waiting period is required to confirm the transaction on the blockchain. 
            Please <b>do not close this tab</b> until the process has finished.
        </div>
    </div>
</template>
<script>

export default {
  name: 'WaitSpinner'
}

</script>
<style scoped>
</style>
