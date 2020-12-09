
<script>
import UserService from "@/services/UserService";
export default {
  name: 'Logout',
  components: {

  },
  mounted() {
    let userService = new UserService(this.$store);
    userService.logout();
    window.location = '/';
  },
  data: function () {
    return {
      errors: []
    }
  },
  methods: {  }
}
</script>

<style lang='scss' scoped='true'>
</style>
