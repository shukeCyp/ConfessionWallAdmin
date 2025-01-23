<template>
  <div class="posts-container">
    <!-- 帖子列表 -->
    <el-table :data="postList" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="用户信息" width="200">
        <template #default="{ row }">
          <div class="user-info">
            <el-avatar :size="30" :src="row.avatar_url" />
            <span>{{ row.nickname }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column label="媒体" width="120">
        <template #default="{ row }">
          <el-button 
            v-if="row.media_list && row.media_list.length > 0"
            link
            type="primary"
            @click="handleViewMedia(row)"
          >
            查看媒体({{ row.media_list.length }})
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStateType(row.state)">
            {{ getStateText(row.state) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180" />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button type="danger" link @click="handleDelete(row)">
            <el-icon><Delete /></el-icon>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 媒体查看对话框 -->
    <el-dialog
      v-model="mediaDialogVisible"
      title="媒体预览"
      width="800px"
      :destroy-on-close="true"
    >
      <div class="media-container">
        <template v-if="currentMedia.length > 0">
          <div 
            v-for="media in currentMedia" 
            :key="media.id"
            class="media-item"
          >
            <img 
              :src="media.url" 
              class="media-image" 
              @click="handlePreviewImage(media.url)"
            />
          </div>
        </template>
        <el-empty v-else description="暂无媒体" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { getPostList, deletePost } from '@/api/post'

// 表格数据
const loading = ref(false)
const postList = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 媒体预览
const mediaDialogVisible = ref(false)
const currentMedia = ref([])

// 查看媒体
const handleViewMedia = (row) => {
  currentMedia.value = row.media_list || []
  mediaDialogVisible.value = true
}

// 预览图片
const handlePreviewImage = (url) => {
  const image = new Image()
  image.src = url
  const newWindow = window.open('')
  newWindow.document.write(image.outerHTML)
}

// 获取帖子列表
const fetchPostList = async () => {
  loading.value = true
  try {
    const res = await getPostList({ 
      page: currentPage.value, 
      page_size: pageSize.value,
      state: 1 // 显示审核通过的帖子
    })
    postList.value = res.data
    total.value = res.total
  } catch (error) {
    console.error('获取帖子列表失败:', error)
    ElMessage.error('获取帖子列表失败')
  } finally {
    loading.value = false
  }
}

// 状态显示
const getStateType = (state) => {
  const types = {
    0: 'info',
    1: 'success',
    2: 'danger'
  }
  return types[state] || 'info'
}

const getStateText = (state) => {
  const texts = {
    0: '待审核',
    1: '已通过',
    2: '已拒绝'
  }
  return texts[state] || '未知'
}

// 删除帖子
const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除这条帖子吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deletePost(row.id)
      ElMessage.success('删除成功')
      fetchPostList()
    } catch (error) {
      console.error('删除帖子失败:', error)
      ElMessage.error('删除帖子失败')
    }
  }).catch(() => {})
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchPostList()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchPostList()
}

// 初始化
onMounted(() => {
  fetchPostList()
})
</script>

<style scoped>
.posts-container {
  padding: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.media-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}

.media-item {
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
}

.media-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s;
}

.media-image:hover {
  transform: scale(1.05);
}
</style> 