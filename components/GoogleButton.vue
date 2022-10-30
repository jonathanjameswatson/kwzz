<template>
  <button
    style="height: 40px; width: 184px"
    class="google-button"
    @click="signIn"
  >
    <div class="google-button-content-wrapper">
      <div class="google-button-icon" style="padding: 10px">
        <div style="width: 18px; height: 18px">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="18px"
            height="18px"
            viewBox="0 0 48 48"
            class="google-button-svg"
          >
            <g>
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              ></path>
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              ></path>
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              ></path>
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              ></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </g>
          </svg>
        </div>
      </div>
      <span
        style="font-size: 14px; line-height: 38px"
        class="google-button-contents"
      >
        <span>Sign in with Google</span>
      </span>
    </div>
  </button>
</template>

<script setup lang="ts">
const supabaseClient = useSupabaseClient()

const signIn = () => {
  supabaseClient.auth.signIn(
    { provider: 'google' },
    {
      redirectTo: `${window.location.origin}/loading`,
    }
  )
}
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');

.google-button {
  border-radius: 1px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transition: background-color 0.218s, border-color 0.218s,
    box-shadow 0.218s;
  transition: background-color 0.218s, border-color 0.218s, box-shadow 0.218s;
  user-select: none;
  background-color: #4285f4;
  background-image: none;
  color: #fff;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  width: auto;
  border: none;
  display: inline-block;
  padding: 0;

  &:hover,
  &:active {
    box-shadow: 0 0 3px 3px rgba(66, 133, 244, 0.3);
    background-color: #4285f4;
  }

  &:active {
    background-color: #3367d6;
  }
}

.google-button-icon {
  float: left;
  background-color: #fff;
  border-radius: 1px;
}

.google-button-svg {
  display: block;
}

.google-button-contents {
  font-family: Roboto, arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.21px;
  margin-left: 6px;
  margin-right: 6px;
  vertical-align: top;
}

.google-button-content-wrapper {
  height: 100%;
  width: 100%;
  border: 1px solid transparent;
}
</style>
