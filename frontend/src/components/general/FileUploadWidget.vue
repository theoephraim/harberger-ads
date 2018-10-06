<template lang='pug'>
.file-upload-widget
  .dropzone(ref='dropzone')
</template>

<script>
/* eslint-disable no-param-reassign */

import _ from 'lodash';
import 'dropzone/dist/dropzone.css';

import VButton from '@/components/general/VButton';

export default {
  name: 'FileUploadWidget',
  components: {
    VButton,
  },
  props: {
    emptyPrompt: { type: String },
    maxFilesizeMb: { type: Number, default: 10 },
    acceptedFileTypes: { type: String },
    getSignedUrl: { type: Function, required: true },
    removeOnDone: { type: Boolean, default: true },
    fileMeta: { type: Object },
  },
  data() {
    return {};
  },
  computed: {
  },
  methods: {
    handleNewFile(file, done) {
      // add file meta details to file
      _.assign(file, this.fileMeta);
      this.getSignedUrl(file).then((url) => {
        file.uploadUrl = url;
        // tell dropzone to process the file
        setTimeout(() => this.dropzone.processFile(file));
        done();
      }).catch((err) => {
        done('Failed to get signed upload URL', err);
      });
    },
  },
  mounted() {
    const Dropzone = require('dropzone'); //eslint-disable-line
    Dropzone.autoDiscover = false;

    // see http://www.dropzonejs.com/#configuration-options
    const options = {
      url: '/',       //  this will be changed for each file
      header: '',   // we will fill this in for each file
      method: 'put',  //  `PUT` upload to S3 directly
      // Hijack the xhr.send since Dropzone always upload file by using formData
      // ref: https://github.com/danialfarid/ng-file-upload/issues/743
      sending(file, xhr) {
        const _send = xhr.send; // eslint-disable-line
        xhr.send = () => { _send.call(xhr, file); };
      },
      parallelUploads: 1,
      uploadMultiple: false,
      maxFilesize: this.maxFilesizeMb,

      // Customize the wording
      ...this.emptyPrompt && { dictDefaultMessage: this.emptyPrompt },

      // We're going to process each file manually (see `accept` below)
      autoProcessQueue: false,
      acceptedFiles: this.acceptedFileTypes,

      // Here we request a signed upload URL when a file being accepted
      accept: this.handleNewFile,
    };

    // Instantiate Dropzone
    this.dropzone = new Dropzone(this.$refs.dropzone, options);
    // Set signed upload URL for each file
    this.dropzone.on('processing', (file) => {
      this.dropzone.options.url = file.uploadUrl;
    });
    this.dropzone.on('complete', (file) => {
      const s3parts = file.uploadUrl.match(/https?:\/\/([^.]*)\.([^.]*)\.[^/]*\/([^?]*)\?.*/);
      file.key = s3parts[3];
      file.bucket = s3parts[1];
      file.region = s3parts[2];
      // file meta details have already been added during signing
      this.$emit('complete', file);
      this.dropzone.removeFile(file);
    });
  },
  beforeDestroy() {
    this.dropzone.destroy();
  },
};
</script>

<style lang='less'>


.file-upload-widget {

  .button {
    max-width: 200px;
  }

  .dropzone {
    border: 2px dashed rgba(0,0,0,.1);
    padding: 10px;
    text-align: center;
    cursor: pointer;
    min-height: 80px;
    &:hover {
      background: rgba(0,0,0,.05);
    }
    .dz-message {
      font-style: italic;
      font-size: 12px;
      line-height: 1.4em;
    }
  }

}


</style>
