GLOBAL_DATUM(character_directory, /datum/character_directory)

/client/verb/show_character_directory()
	set name = "Character Directory"
	set category = "OOC"
	set desc = "Shows a listing of all active characters, along with their associated OOC notes, flavor text, and more."

	// This is primarily to stop malicious users from trying to lag the server by spamming this verb
	if(!usr.checkMoveCooldown())
		to_chat(usr, "<span class='warning'>Don't spam character directory refresh.</span>")
		return
	usr.setMoveCooldown(10)

	if(!GLOB.character_directory)
		GLOB.character_directory = new
	GLOB.character_directory.tgui_interact(mob)


// This is a global singleton. Keep in mind that all operations should occur on usr, not src.
/datum/character_directory
/datum/character_directory/tgui_state(mob/user)
	return GLOB.tgui_always_state

/datum/character_directory/tgui_interact(mob/user, datum/tgui/ui, datum/tgui/parent_ui)
	ui = SStgui.try_update_ui(user, src, ui)
	if(!ui)
		ui = new(user, src, "CharacterDirectory", "Character Directory")
		ui.open()

/datum/character_directory/tgui_data(mob/user, datum/tgui/ui, datum/tgui_state/state)
	var/list/data = ..()

	data["personalVisibility"] = user?.client?.prefs?.show_in_directory
	data["personalTag"] = user?.client?.prefs?.directory_tag || "Unset"
	data["personalGenderTag"] = user?.client?.prefs?.directory_gendertag || "Unset"
	data["personalSexualityTag"] = user?.client?.prefs?.directory_sexualitytag || "Unset"
	data["personalErpTag"] = user?.client?.prefs?.directory_erptag || "Unset"
	data["personalBDSMTag"] = user?.client?.prefs?.directory_bdsmtag || "Unset"
	data["personalFurryPrefTag"] = user?.client?.prefs?.directory_furrypreftag || "Unset"
	data["personalEventTag"] = vantag_choices_list[user?.client?.prefs?.vantag_preference] //CHOMPEdit

	return data

/datum/character_directory/tgui_static_data(mob/user, datum/tgui/ui, datum/tgui_state/state)
	var/list/data = ..()

	var/list/directory_mobs = list()
	for(var/client/C in GLOB.clients)
		// Allow opt-out.
		if(!C?.prefs?.show_in_directory)
			continue

		// These are the three vars we're trying to find
		// The approach differs based on the mob the client is controlling
		var/name = null
		var/species = null
		var/ooc_notes = null
		var/flavor_text = null
		var/tag = C.prefs.directory_tag || "Unset"
		var/gendertag = C.prefs.directory_gendertag || "Unset"
		var/sexualitytag = C.prefs.directory_sexualitytag || "Unset"
		var/erptag = C.prefs.directory_erptag || "Unset"
		var/bdsmtag = C.prefs.directory_bdsmtag || "Unset"
		var/furrypreftag = C.prefs.directory_furrypreftag || "Unset"
		var/eventtag = vantag_choices_list[C.prefs.vantag_preference] //CHOMPEdit
		var/character_ad = C.prefs.directory_ad

		//CHOMPEdit Start
		if(ishuman(C.mob))
			var/mob/living/carbon/human/H = C.mob
			var/strangername = H.real_name
			if(data_core && data_core.general)
				if(!find_general_record("name", H.real_name))
					if(!find_record("name", H.real_name, data_core.hidden_general))
						strangername = "unknown"
			name = strangername
			species = "[H.custom_species ? H.custom_species : H.species.name]"
			ooc_notes = H.ooc_notes
			if(LAZYLEN(H.flavor_texts))
				flavor_text = H.flavor_texts["general"]

		if(isAI(C.mob))
			var/mob/living/silicon/ai/A = C.mob
			name = A.name
			species = "Artificial Intelligence"
			ooc_notes = A.ooc_notes
			flavor_text = null // No flavor text for AIs :c

		if(isrobot(C.mob))
			var/mob/living/silicon/robot/R = C.mob
			if(R.scrambledcodes || (R.module && R.module.hide_on_manifest))
				continue
			name = R.name
			species = "[R.modtype] [R.braintype]"
			ooc_notes = R.ooc_notes
			flavor_text = R.flavor_text

		if(istype(C.mob, /mob/living/silicon/pai))
			var/mob/living/silicon/pai/P = C.mob
			name = P.name
			species = "pAI"
			ooc_notes = P.ooc_notes
			if(P.print_flavor_text())
				flavor_text = "\n[P.print_flavor_text()]\n"

		if(istype(C.mob, /mob/living/simple_mob))
			var/mob/living/simple_mob/S = C.mob
			name = S.name
			species = "simplemob"
			ooc_notes = S.ooc_notes
			flavor_text = S.desc
			//CHOMPEdit End

		// It's okay if we fail to find OOC notes and flavor text
		// But if we can't find the name, they must be using a non-compatible mob type currently.
		if(!name)
			continue

		directory_mobs.Add(list(list(
			"name" = name,
			"species" = species,
			"ooc_notes" = ooc_notes,
			"tag" = tag,
			"gendertag" = gendertag,
			"sexualitytag" = sexualitytag,
			"erptag" = erptag,
			"bdsmtag" = bdsmtag,
			"furrypreftag" = furrypreftag,
			"eventtag" = eventtag, //CHOMPEdit
			"character_ad" = character_ad,
			"flavor_text" = flavor_text,
		)))

	data["directory"] = directory_mobs

	return data


/datum/character_directory/tgui_act(action, list/params, datum/tgui/ui, datum/tgui_state/state)
	. = ..()
	if(.)
		return

	switch(action)
		if("refresh")
			// This is primarily to stop malicious users from trying to lag the server by spamming this verb
			if(!usr.checkMoveCooldown())
				to_chat(usr, "<span class='warning'>Don't spam character directory refresh.</span>")
				return
			usr.setMoveCooldown(10)
			update_tgui_static_data(usr, ui)
			return TRUE
		if("setTag")
			var/list/new_tag = tgui_input_list(usr, "Pick a new Vore tag for the character directory", "Character Tag", GLOB.char_directory_tags)
			if(!new_tag)
				return
			usr?.client?.prefs?.directory_tag = new_tag
			return TRUE
		if("setGenderTag")
			var/list/new_gendertag = tgui_input_list(usr, "Pick a new Gender tag for the character directory. This is YOUR gender, not what you prefer.", "Character Gender Tag", GLOB.char_directory_gendertags)
			if(!new_gendertag)
				return
			usr?.client?.prefs?.directory_gendertag = new_gendertag
			return TRUE
		if("setSexualityTag")
			var/list/new_sexualitytag = tgui_input_list(usr, "Pick a new Sexuality/Orientation tag for the character directory", "Character Sexuality/Orientation Tag", GLOB.char_directory_sexualitytags)
			if(!new_sexualitytag)
				return
			usr?.client?.prefs?.directory_sexualitytag = new_sexualitytag
			return TRUE
		if("setErpTag")
			var/list/new_erptag = tgui_input_list(usr, "Pick a new ERP tag for the character directory", "Character ERP Tag", GLOB.char_directory_erptags)
			if(!new_erptag)
				return
			usr?.client?.prefs?.directory_erptag = new_erptag
			return TRUE
		if("setBDSMTag")
			var/list/new_bdsmtag = tgui_input_list(usr, "Pick a new BDSM tag for the character directory", "Character BDSM Tag", GLOB.char_directory_bdsmtags)
			if(!new_bdsmtag)
				return
			usr?.client?.prefs?.directory_bdsmtag = new_bdsmtag
			return TRUE
		if("setFurryPrefTag")
			var/list/new_furrypreftag = tgui_input_list(usr, "Pick a new Furry/Human preference tag for the character directory", "Character Furry/Human Preference", GLOB.char_directory_furrypreftags)
			if(!new_furrypreftag)
				return
			usr?.client?.prefs?.directory_furrypreftag = new_furrypreftag
			return TRUE
		//CHOMPEdit start
		if("setEventTag")
			var/list/names_list = list()
			for(var/C in vantag_choices_list)
				names_list[vantag_choices_list[C]] = C
			var/list/new_eventtag = input(usr, "Pick your preference for event involvement", "Event Preference Tag", usr?.client?.prefs?.vantag_preference) as null|anything in names_list
			if(!new_eventtag)
				return
			usr?.client?.prefs?.vantag_preference = names_list[new_eventtag]
			return TRUE
		//CHOMPEdit end
		if("setVisible")
			usr?.client?.prefs?.show_in_directory = !usr?.client?.prefs?.show_in_directory
			to_chat(usr, "<span class='notice'>You are now [usr.client.prefs.show_in_directory ? "shown" : "not shown"] in the directory.</span>")
			return TRUE
		if("editAd")
			if(!usr?.client?.prefs)
				return

			var/current_ad = usr.client.prefs.directory_ad
			var/new_ad = sanitize(tgui_input_text(usr, "Change your character ad", "Character Ad", current_ad, multiline = TRUE, prevent_enter = TRUE), extra = 0)
			if(isnull(new_ad))
				return
			usr.client.prefs.directory_ad = new_ad
			return TRUE
