<template>
  <div class="complete">
    <h2>Redirecting to Paypal...</h2>
    <div class="complete__summary">
      You will be redirected to Paypal in order to complete your payment. <br/>
      In case something goes wrong, please <a href="$store.checkout.payment.paypalPaymentLink">click this link</a>.
    </div>
    <loading-spinner :loading="true"></loading-spinner>
  </div>
</template>

<script>
  import LoadingSpinner from '../shared/LoadingSpinner'
  export default {
    components: {LoadingSpinner}, name: 'PaymentRedirect'
  }
</script>
