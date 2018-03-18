<template lang="html">
  <div class="section">
    <div class="remote-view">
      <video ref="remoteView" poster="../assets/tv-static.gif"></video>
    </div>
    <div class="self-view">
      <video ref="selfView" muted="true" poster="../assets/tv-static.gif"></video>
    </div>
  </div>
</template>

<script>
import socket from '../socket';

export default {
  name: 'room',
  data() {
    return {
      constraints: {
        audio: true,
        video: {
          facingMode: 'user',
          frameRate: { ideal: 10, max: 30 },
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
        },
      },
      iceServers: {
        'iceServers': [
          { 'urls': 'stun:stun.services.mozilla.com' },
          { 'urls': 'stun:stun.l.google.com:19302' },
        ],
      },
      stream: null, // local stream
      pc: null, // local peer connection
      roomName: location.pathname.substring(1),
    }
  },

  methods: {
    call(id) {
      if (this.pc) return;

      this.pc = new RTCPeerConnection(this.iceServers);

      this.pc.onicecandidate = (evt) => {
        if (!evt || !evt.candidate) return;
        socket.emit('candidate', { to: id, from: socket.id, candidate: evt.candidate });
      };

      this.pc.onnegotiationneeded = () => {
        this.pc.createOffer()
          .then(offer => this.pc.setLocalDescription(offer))
          .then(() => {
            socket.emit('offer', {
              to: id,
              from: socket.id,
              desc: this.pc.localDescription,
            });
          })
          .catch(e => console.log(e));
      };

      this.pc.ontrack = (evt) => {
        if (!!this.$refs.remoteView.paused) {
          this.$refs.remoteView.srcObject = evt.streams[0];
          this.$refs.remoteView.play();
        }
      };


      this.pc.addTrack(this.stream.getAudioTracks()[0], this.stream);
      this.pc.addTrack(this.stream.getVideoTracks()[0], this.stream);
    },
    connect() {
      socket.emit('join', { room: this.roomName });
    },
    joined({ id }) {
      this.call(id);
    },
    leave({ id }) {
      this.pc.close();
      this.pc = null;
      this.$refs.remoteView.pause();
    },
    candidate({ to, from, candidate }) {
      if (to === socket.id) {
        this.call(from);
        this.pc.addIceCandidate(candidate).catch(e => console.log(e));
      }
    },
    offer({ to, from, desc }) {
      if (to === socket.id) {
        this.call(from);
        this.pc.setRemoteDescription(desc)
          .then(() => this.pc.createAnswer())
          .then(answer => this.pc.setLocalDescription(answer))
          .then(() => {
            socket.emit('answer', {
              to: from,
              from: socket.id,
              desc: this.pc.localDescription,
            });
          })
          .catch(e => console.log(e));
      }
    },
    answer({ to, from, desc }) {
      if (to === socket.id) {
        this.call(from);
        this.pc.setRemoteDescription(desc).catch(e => console.log(e));
      }
    },
  },


  mounted() {
    // socket.on('connect', this.connect);
    socket.on('joined', this.joined);
    socket.on('leave', this.leave);
    socket.on('candidate', this.candidate);
    socket.on('offer', this.offer);
    socket.on('answer', this.answer);
  },


  created() {
    navigator.mediaDevices.getUserMedia(this.constraints)
    .then(stream => this.stream = stream)
    .catch(err => console.log(err.message));
  },

  watch: {
    stream(value) {
      if (value) {
        this.$refs.selfView.srcObject = value;
        this.$refs.selfView.play();
        this.connect()
      };
    }
  }
}
</script>

<style lang="css">
.remote-view {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
}

.self-view {
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 130px;
  height: 130px;
  overflow: hidden;
  border: 3px solid #000;
  background-color: #000;
}

.remote-view > video,
.self-view > video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 1. No object-fit support: */
@media (min-aspect-ratio: 16/9) {
  #remote-view > video { height: 300%; top: -100%; }
}

@media (max-aspect-ratio: 16/9) {
  #remote-view > video { width: 300%; left: -100%; }
}

/* 2. If supporting object-fit, overriding (1): */
@supports (object-fit: cover) {
  #remote-view > video {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
