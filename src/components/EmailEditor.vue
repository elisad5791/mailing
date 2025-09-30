<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { onBeforeUnmount, computed, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const editor = useEditor({
  content: '',
  extensions: [StarterKit],
  editorProps: {
    attributes: {
      class: 'prose focus:outline-none max-w-none',
    },
  },
  onUpdate: ({ editor }) => {
    const html = editor.getHTML();
    emit('update:modelValue', html);
  },
});

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});

watch(() => props.modelValue, (newValue) => {
  if (newValue !== editor.value?.getHTML()) {
    editor.value?.commands.setContent(newValue, false);
  }
});

const boldColor = computed(() => editor.value?.isActive('bold') ? 'primary' : undefined);
const italicColor = computed(() => editor.value?.isActive('italic') ? 'primary' : undefined);
const h2Color = computed(() => editor.value?.isActive('heading', { level: 2 }) ? 'primary' : undefined);
const listColor = computed(() => editor.value?.isActive('bulletList') ? 'primary' : undefined);

function toggleBold() {
  editor.value?.chain().focus().toggleBold().run();
}

function toggleItalic() {
  editor.value?.chain().focus().toggleItalic().run();
}

function toggleH2() {
  editor.value?.chain().focus().toggleHeading({ level: 2 }).run();
}

function toggleList() {
  editor.value?.chain().focus().toggleBulletList().run();
}
</script>

<template>
  <v-card variant="outlined" class="mb-4">
    <v-card-text class="pa-0">
      <v-toolbar density="compact">
        <v-btn variant="text" size="small" :disabled="!editor" @click="toggleBold" :color="boldColor">
          <strong>B</strong>
        </v-btn>
        
        <v-btn variant="text" size="small" :disabled="!editor" @click="toggleItalic" :color="italicColor">
          <em>I</em>
        </v-btn>
                
        <v-btn variant="text" size="small" :disabled="!editor" @click="toggleH2" :color="h2Color">
          H2
        </v-btn>
        
        <v-btn variant="text" size="small" :disabled="!editor" @click="toggleList" :color="listColor">
          • List
        </v-btn>
      </v-toolbar>
      
      <editor-content :editor="editor" class="pa-4" />
    </v-card-text>
  </v-card>
</template>

<style scoped>


:deep(.ProseMirror) {
  outline: none;
  min-height: 150px;
}

:deep(.ProseMirror ul) {
  padding-left: 1.5em;
}

:deep(.ProseMirror p) {
  margin: 0.5em 0;
}
</style>