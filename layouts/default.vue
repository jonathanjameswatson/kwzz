<template>
  <div>
    <b-navbar wrapper-class="container" transparent :close-on-click="false" shadow>
      <template slot="brand">
        <b-navbar-item tag="nuxt-link" to="/">
          <figure class="image is-64x64">
            <img src="~/assets/logo.png">
          </figure>
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="div">
          <b-field label="Search" horizontal>
            <b-input type="search" icon="magnify"/>
          </b-field>
        </b-navbar-item>
      </template>

      <template slot="end">
        <b-navbar-item tag="div">
          <div class="buttons">
            <b-button type="is-primary" rounded outlined>Register</b-button>
            <b-button type="is-primary" rounded outlined>Sign in</b-button>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>

    <div class="container">
      <nuxt/>
    </div>
  </div>
</template>