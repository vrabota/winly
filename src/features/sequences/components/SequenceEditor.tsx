import React, { useEffect } from 'react';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { Group, Text, TextInput, Divider, Button } from '@mantine/core';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';
import { useRouter } from 'next/router';

import { api } from '@utils/api';

import type { SequencesType } from '@server/api/campaigns/data/dtos';
import type { ChangeEvent } from 'react';

export const SequenceEditor = ({
  updateSequence,
  subject,
  body,
  sequences,
  activeIndex,
}: {
  updateSequence: ({ subject, body }: { subject?: string; body?: string }) => void;
  subject: string;
  body: string;
  sequences: SequencesType[];
  activeIndex: number;
}) => {
  const { mutate } = api.campaign.updateSequences.useMutation();
  const { query } = useRouter();
  const editor = useEditor(
    {
      extensions: [StarterKit, Link],
      onBlur({ editor }) {
        console.log(editor?.getHTML());
        updateSequence({ body: editor?.getHTML() });
      },
      parseOptions: {
        preserveWhitespace: 'full',
      },
      content: body,
    },
    [activeIndex],
  );
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.commands.setContent(body);
    }
  }, [body, editor]);
  const createSequence = () => {
    if (editor?.getHTML()) {
      mutate(
        { campaignId: query.campaignId as string, sequences },
        {
          onSuccess: () => {
            showNotification({
              color: 'teal',
              message: `Step saved.`,
              autoClose: 2000,
              icon: <IconCheck size={16} />,
            });
          },
        },
      );
    }
  };

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
          <TextInput
            value={subject}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateSequence({ subject: e.target.value })}
            placeholder="Add your subject here"
            variant="unstyled"
            wrapperProps={{ sx: { flexGrow: 1 } }}
          />
        </Group>
        <Group>
          <Divider orientation="vertical" />
          <Button onClick={createSequence}>Save</Button>
        </Group>
      </Group>
      <RichTextEditor sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }} editor={editor}>
        <RichTextEditor.Content
          sx={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            height: 368,
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
