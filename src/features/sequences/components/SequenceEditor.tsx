import React, { useEffect } from 'react';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { Group, Text, TextInput, Divider, Button, Paper, Anchor, Box, Tooltip } from '@mantine/core';
import { useEditor } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Highlight } from '@tiptap/extension-highlight';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';
import { useRouter } from 'next/router';

import { api } from '@utils/api';

import type { SequencesType } from '@server/api/campaigns/campaigns.dto';
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
      extensions: [StarterKit, Link, Highlight, Underline, TextAlign.configure({ types: ['heading', 'paragraph'] })],
      onBlur({ editor }) {
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
      <Paper bg="white" radius="md" shadow="xs">
        <Group
          position="apart"
          align="center"
          px={25}
          py={10}
          sx={theme => ({ flexGrow: 1, borderBottom: `1px solid ${theme.colors.gray[1]}` })}
        >
          <Group sx={{ flexGrow: 1 }} align="center">
            <Text component="label" htmlFor="subject" size={14} weight={500}>
              Subject:
            </Text>
            <TextInput
              id="subject"
              sx={{ fontSize: 14, fontWeight: 500 }}
              value={subject}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateSequence({ subject: e.target.value })}
              placeholder="Add your subject here"
              variant="unstyled"
              mt={-5}
              wrapperProps={{ sx: { flexGrow: 1 } }}
            />
          </Group>
          <Group align="center">
            <Divider color="gray.3" h={25} mt={5} mr={10} orientation="vertical" />
            <Button radius="md" onClick={createSequence}>
              Save
            </Button>
          </Group>
        </Group>
        <RichTextEditor sx={{ border: 0, fontSize: 14 }} editor={editor}>
          <RichTextEditor.Content
            sx={{
              height: 368,
              '.ProseMirror': { height: 336, overflowY: 'auto', fontSize: 14 },
            }}
          />
          <Box sx={{ padding: '20px 25px' }}>
            <Tooltip
              label="A link back to Winly is required on our free Starter plan. Upgrade to remove the link"
              openDelay={200}
              withArrow
            >
              <Text sx={{ display: 'inline' }}>
                This email was sent by{' '}
                <Anchor href="https://winly.ai" target="_blank">
                  winly.ai
                </Anchor>
              </Text>
            </Tooltip>
          </Box>

          <RichTextEditor.Toolbar
            sx={theme => ({
              borderBottom: 0,
              borderRadius: 0,
              padding: '20px 25px',
              borderBottomLeftRadius: theme.radius.md,
              borderBottomRightRadius: theme.radius.md,
              borderTop: `1px solid ${theme.colors.gray[1]}`,
            })}
          >
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
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>
            <Box sx={{ marginLeft: 'auto' }}>
              <Button size="xs" variant="outline">
                Upgrade
              </Button>
            </Box>
          </RichTextEditor.Toolbar>
        </RichTextEditor>
      </Paper>
    </>
  );
};
