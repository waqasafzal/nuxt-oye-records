<template>
  <div class="complete">
    <h2>Subscribe to newsletter</h2>
    <form 
      id="newsletter-form" 
      class="newsletter-form" 
      @submit.prevent="onSubmit">
      <fieldset>
        <div class="form-group">
          <div :class="['email-input', 'form-group-item', 'input-validation', emailError ? 'has-danger': '']">
            <input 
              id="email"
              v-model="email"
              class="form-control"
              type="text"
              placeholder="Email *"
              required>
            <div 
              v-if="emailError" 
              class="error">{{ emailError }}</div>
          </div>
        </div>
      </fieldset>
      <div class="btn-row">
        <button 
          class="btn primary" 
          type="submit" 
          form="newsletter-form">Subscribe</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Newsletter',
  data: function() {
    return {
      email: ''
    }
  },
  computed: {
    emailError() {
      return this.$store.getters.getUserFormEmailError
    }
  },
  methods: {
    onSubmit() {
      let vm = this
      this.$store
        .dispatch('emailValidation', { email: this.email })
        .then(isValid => {
          if (isValid) {
            vm.$store
              .dispatch('subscribeNewsletter', { email: this.email })
              .then(ok => {
                if (ok) {
                  vm.$store.dispatch('addAlert', {
                    message: `Your email ${
                      this.email
                    } was added to our mailing list`,
                    level: 'info'
                  })
                  this.$router.push('/')
                } else {
                  vm.$store.dispatch('addAlert', {
                    message:
                      'Something went wrong. Please try submitting this form again',
                    level: 'info'
                  })
                }
              })
          }
        })
    }
  }
}
</script>
