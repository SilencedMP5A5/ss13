import { useState } from 'react';

import { useBackend } from '../../backend';
import {
  Box,
  Button,
  Icon,
  LabeledList,
  Section,
  Table,
} from '../../components';
import { Window } from '../../layouts';

const getTagColor = (tag) => {
  switch (tag) {
    case 'Unset':
      return 'label';
    case 'Pred':
      return 'red';
    case 'Pred-Pref':
      return 'orange';
    case 'Prey':
      return 'blue';
    case 'Prey-Pref':
      return 'green';
    case 'Switch':
      return 'yellow';
    case 'Non-Vore':
      return 'black';
  }
};

export const CharacterDirectory = (props) => {
  const { act, data } = useBackend();

  const {
    personalVisibility,
    personalTag,
    personalGenderTag,
    personalSexualityTag,
    personalErpTag,
    personalEventTag,
  } = data;

  const [overlay, setOverlay] = useState(null);
  const [overwritePrefs, setOverwritePrefs] = useState(false);

  function handleOverlay(value) {
    setOverlay(value);
  }

  return (
    <Window width={816} height={722} resizeable>
      <Window.Content scrollable>
        {(overlay && (
          <ViewCharacter overlay={overlay} onOverlay={handleOverlay} />
        )) || (
          <>
            <Section
              title="Settings and Preferences"
              buttons={
                <>
                  <Box color="label" inline>
                    Save to current preferences slot:&nbsp;
                  </Box>
                  <Button
                    icon={overwritePrefs ? 'toggle-on' : 'toggle-off'}
                    selected={overwritePrefs}
                    content={overwritePrefs ? 'On' : 'Off'}
                    onClick={() => setOverwritePrefs(!overwritePrefs)}
                  />
                </>
              }
            >
              <LabeledList>
                <LabeledList.Item label="Visibility">
                  <Button
                    fluid
                    content={personalVisibility ? 'Shown' : 'Not Shown'}
                    onClick={() =>
                      act('setVisible', { overwrite_prefs: overwritePrefs })
                    }
                  />
                </LabeledList.Item>
                <LabeledList.Item label="Vore Tag">
                  <Button
                    fluid
                    content={personalTag}
                    onClick={() =>
                      act('setTag', { overwrite_prefs: overwritePrefs })
                    }
                  />
                </LabeledList.Item>
                <LabeledList.Item label="Gender">
                  <Button
                    fluid
                    content={personalGenderTag}
                    onClick={() =>
                      act('setGenderTag', { overwrite_prefs: overwritePrefs })
                    }
                  />
                </LabeledList.Item>
                <LabeledList.Item label="Sexuality">
                  <Button
                    fluid
                    content={personalSexualityTag}
                    onClick={() =>
                      act('setSexualityTag', {
                        overwrite_prefs: overwritePrefs,
                      })
                    }
                  />
                </LabeledList.Item>
                <LabeledList.Item label="ERP Tag">
                  <Button
                    fluid
                    content={personalErpTag}
                    onClick={() =>
                      act('setErpTag', { overwrite_prefs: overwritePrefs })
                    }
                  />
                </LabeledList.Item>
                <LabeledList.Item label="Event Pref">
                  <Button
                    fluid
                    content={personalEventTag}
                    onClick={() =>
                      act('setEventTag', { overwrite_prefs: overwritePrefs })
                    }
                  />
                </LabeledList.Item>
                <LabeledList.Item label="Advertisement">
                  <Button
                    fluid
                    content="Edit Ad"
                    onClick={() =>
                      act('editAd', { overwrite_prefs: overwritePrefs })
                    }
                  />
                </LabeledList.Item>
              </LabeledList>
            </Section>
            <CharacterDirectoryList onOverlay={handleOverlay} />
          </>
        )}
      </Window.Content>
    </Window>
  );
};

const ViewCharacter = (props) => {
  return (
    <Section
      title={props.overlay.name}
      buttons={
        <Button
          icon="arrow-left"
          content="Back"
          onClick={() => props.onOverlay(null)}
        />
      }
    >
      <Section level={2} title="Species">
        <Box>{props.overlay.species}</Box>
      </Section>
      <Section level={2} title="Vore Tag">
        <Box p={1} backgroundColor={getTagColor(props.overlay.tag)}>
          {props.overlay.tag}
        </Box>
      </Section>
      <Section level={2} title="Gender">
        <Box>{props.overlay.gendertag}</Box>
      </Section>
      <Section level={2} title="Sexuality">
        <Box>{props.overlay.sexualitytag}</Box>
      </Section>
      <Section level={2} title="ERP Tag">
        <Box>{props.overlay.erptag}</Box>
      </Section>
      <Section level={2} title="Event Pref">
        <Box>{props.overlay.eventtag}</Box>
      </Section>
      <Section level={2} title="Character Ad">
        <Box style={{ 'word-break': 'break-all' }} preserveWhitespace>
          {props.overlay.character_ad || 'Unset.'}
        </Box>
      </Section>
      <Section level={2} title="OOC Notes">
        <Box style={{ 'word-break': 'break-all' }} preserveWhitespace>
          {props.overlay.ooc_notes || 'Unset.'}
          {props.overlay.ooc_notes_style &&
          (props.overlay.ooc_notes_favs ||
            props.overlay.ooc_notes_likes ||
            props.overlay.ooc_notes_maybes ||
            props.overlay.ooc_notes_dislikes) ? (
            <Table>
              <Table.Row bold>
                {props.overlay.ooc_notes_favs ? (
                  <Table.Cell>FAVOURITES</Table.Cell>
                ) : (
                  ''
                )}
                {props.overlay.ooc_notes_likes ? (
                  <Table.Cell>LIKES</Table.Cell>
                ) : (
                  ''
                )}
                {props.overlay.ooc_notes_maybes ? (
                  <Table.Cell>MAYBES</Table.Cell>
                ) : (
                  ''
                )}
                {props.overlay.ooc_notes_dislikes ? (
                  <Table.Cell>DISLIKES</Table.Cell>
                ) : (
                  ''
                )}
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <br />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                {props.overlay.ooc_notes_favs ? (
                  <Table.Cell>{props.overlay.ooc_notes_favs}</Table.Cell>
                ) : (
                  ''
                )}
                {props.overlay.ooc_notes_likes ? (
                  <Table.Cell>{props.overlay.ooc_notes_likes}</Table.Cell>
                ) : (
                  ''
                )}
                {props.overlay.ooc_notes_maybes ? (
                  <Table.Cell>{props.overlay.ooc_notes_maybes}</Table.Cell>
                ) : (
                  ''
                )}
                {props.overlay.ooc_notes_dislikes ? (
                  <Table.Cell>{props.overlay.ooc_notes_dislikes}</Table.Cell>
                ) : (
                  ''
                )}
              </Table.Row>
            </Table>
          ) : (
            ''
          )}
        </Box>
      </Section>
      <Section level={2} title="Flavor Text">
        <Box style={{ 'word-break': 'break-all' }} preserveWhitespace>
          {props.overlay.flavor_text || 'Unset.'}
        </Box>
      </Section>
    </Section>
  );
};

const CharacterDirectoryList = (props) => {
  const { act, data } = useBackend();

  const { directory } = data;

  const [sortId, _setSortId] = useState('name');
  const [sortOrder, _setSortOrder] = useState('name');

  return (
    <Section
      title="Directory"
      buttons={
        <Button icon="sync" content="Refresh" onClick={() => act('refresh')} />
      }
    >
      <Table>
        <Table.Row bold>
          <SortButton id="name">Name</SortButton>
          <SortButton id="species">Species</SortButton>
          <SortButton id="tag">Vore Tag</SortButton>
          <SortButton id="gendertag">Gender</SortButton>
          <SortButton id="sexualitytag">Sexuality</SortButton>
          <SortButton id="erptag">ERP Tag</SortButton>
          <SortButton id="eventtag">Event Pref</SortButton>
          <Table.Cell collapsing textAlign="right">
            View
          </Table.Cell>
        </Table.Row>
        {directory
          .sort((a, b) => {
            const i = sortOrder ? 1 : -1;
            return a[sortId].localeCompare(b[sortId]) * i;
          })
          .map((character, i) => (
            <Table.Row key={i} backgroundColor={getTagColor(character.tag)}>
              <Table.Cell p={1}>{character.name}</Table.Cell>
              <Table.Cell>{character.species}</Table.Cell>
              <Table.Cell>{character.tag}</Table.Cell>
              <Table.Cell>{character.gendertag}</Table.Cell>
              <Table.Cell>{character.sexualitytag}</Table.Cell>
              <Table.Cell>{character.erptag}</Table.Cell>
              <Table.Cell>{character.eventtag}</Table.Cell>
              <Table.Cell collapsing textAlign="right">
                <Button
                  onClick={() => props.onOverlay(character)}
                  color="transparent"
                  icon="sticky-note"
                  mr={1}
                  content="View"
                />
              </Table.Cell>
            </Table.Row>
          ))}
      </Table>
    </Section>
  );
};

const SortButton = (props) => {
  const { act, data } = useBackend();

  const { id, children } = props;

  // Hey, same keys mean same data~
  const [sortId, setSortId] = useState('name');
  const [sortOrder, setSortOrder] = useState('name');

  return (
    <Table.Cell collapsing>
      <Button
        width="100%"
        color={sortId !== id && 'transparent'}
        onClick={() => {
          if (sortId === id) {
            setSortOrder(!sortOrder);
          } else {
            setSortId(id);
            setSortOrder(true);
          }
        }}
      >
        {children}
        {sortId === id && (
          <Icon name={sortOrder ? 'sort-up' : 'sort-down'} ml="0.25rem;" />
        )}
      </Button>
    </Table.Cell>
  );
};
