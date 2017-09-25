<template>
  <div class="complete">
    <h2>Subscribe to newsletter</h2>
    <form id="newsletter-form" @submit.prevent="onSubmit" class="newsletter-form">
      <fieldset>
        <div class="form-group">
          <div :class="['email-input', 'form-group-item', 'input-validation', emailError ? 'has-danger': '']">
            <input class="form-control"
                   type="text"
                   id="email"
                   placeholder="Email *"
                   v-model="email"
                   required>
            <div v-if="emailError" class="error">{{ emailError }}</div>
          </div>
        </div>
      </fieldset>
      <fieldset>
        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" name="weekly" v-model="weekly">Weekly News
            </label>
        </div>
        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" name="monthly" v-model="monthly">Monthly Bestsellers
            </label>
        </div>
      </fieldset>
      <div class="btn-row">
        <button class="btn primary" type="submit" form="newsletter-form">Subscribe</button>
      </div>
    </form>
  </div>
</template>actio



<script>
  export default {
    name: 'Newsletter',
    data: function () {
      return {
        email: '',
        weekly: true,
        monthly: true
      }
    },
    computed: {
      emailError () {
        return this.$store.getters.getUserFormEmailError
      }
    },
    methods: {
      onSubmit () {
        let vm = this
        this.$store.dispatch('emailValidation', {email: this.email}).then(
          isValid => {
            if (isValid) {
              vm.$store.dispatch('subscribeNewsletter', {email: this.email}).then(
                ok => {
                  if (ok) {
                    vm.$store.dispatch('addAlert', {
                      message: `Your email ${this.email} was added to our mailing list`,
                      level: 'info'
                    })
                    this.$router.push('/')
                  } else {
                    vm.$store.dispatch('addAlert', {
                      message: 'Something went wrong. Please try submitting this form again',
                      level: 'info'
                    })
                  }
                }
              )
            }
          })
      }
    }
  }
</script>
