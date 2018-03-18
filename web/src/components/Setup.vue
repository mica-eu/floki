<template lang="html">
  <div class="section">
    <div class="container setup">
      <div class="box">
        <div class="media-content">
          <div class="content">
            <p class="title">
              Crie um ambiente
            </p>
            <div class="field has-addons">
              <p class="control">
                <a class="button is-static">
                  {{appURL}}/
                </a>
              </p>
              <p class="control">
                <input
                  class="input"
                  type="text"
                  maxlength="20"
                  v-model="roomName"
                  v-room-name>
              </p>
            </div>
            <div class="field">
              <p class="control">
                <router-link
                  class="button is-primary is-outlined is-fullwidth"
                  :to="{ name: 'room', params: { id: roomName } }">
                  🚀 Criar ambiente
                </router-link>
              </p>
            </div>
          </div> <!-- .content -->
        </div> <!-- .media-content -->
      </div> <!-- .box -->
    </div> <!-- .container -->
  </div>
</template>

<script>
export default {
  name: 'setup',
  data() {
    return {
      appURL: `${window.location.host}`,
      roomName: Date.now(),
    }
  },
}
</script>

<style lang="css">
.setup {
  max-width: 350px;
}
</style>
