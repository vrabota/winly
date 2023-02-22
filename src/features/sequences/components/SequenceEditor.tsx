import React from 'react';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { Group, Text, TextInput, Divider, Button } from '@mantine/core';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';

export const SequenceEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit, Link],
  });
  return (
    <>
      <Group
        position="left"
        align="center"
        p={15}
        sx={theme => ({
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          border: `1px solid ${theme.colors.gray[4]}`,
          borderBottom: 'none',
        })}
      >
        <Group sx={{ flexGrow: 1 }}>
          <Text weight="bolder">Subject</Text>
          <TextInput placeholder="Add your subject here" variant="unstyled" wrapperProps={{ sx: { flexGrow: 1 } }} />
        </Group>
        <Group>
          <Divider orientation="vertical" />
          <Button>Save</Button>
        </Group>
      </Group>
      <RichTextEditor sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }} editor={editor}>
        <RichTextEditor.Content
          sx={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            '.ProseMirror': { height: 336, overflowY: 'auto' },
          }}
        />
        <RichTextEditor.Toolbar>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
      </RichTextEditor>
    </>
  );
};