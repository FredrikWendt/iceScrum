%{--
- Copyright (c) 2011 Kagilum SAS.
-
- This file is part of iceScrum.
-
- iceScrum is free software: you can redistribute it and/or modify
- it under the terms of the GNU Affero General Public License as published by
- the Free Software Foundation, either version 3 of the License.
-
- iceScrum is distributed in the hope that it will be useful,
- but WITHOUT ANY WARRANTY; without even the implied warranty of
- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
- GNU General Public License for more details.
-
- You should have received a copy of the GNU Affero General Public License
- along with iceScrum.  If not, see <http://www.gnu.org/licenses/>.
-
- Authors:
-
- Vincent Barrier (vbarrier@kagilum.com)
--}%
<%@ page import="org.icescrum.core.domain.Task; org.icescrum.core.domain.Sprint" %>
<g:set var="task" value="[id:'?**=this.id**?',
                           name:'?**=name**?',
                           creator:[id:'?**=user_id**?'],
                           responsible:[id:'?**=user_id**?'],
                           description:'?**=description**?',
                           totalAttachments:'?**=this.totalAttachments**?']"/>
<g:set var="user" value="[id:'?**=this.id**?']"/>

<template id="postit-task-${id}-tmpl">
    <![CDATA[
    ?**
    var name =  this.name ? this.name : '';
    var truncatedName = name.length > 17 ? name.substring(0,14)+'...' : name;
    var description =  this.description ? this.description : '';
    var typeTitle = this.blocked ? '${message(code: 'is.task.blocked')}' : '';
    var typeNumber = this.blocked ? 1 : 0;
    var estimation = this.estimation != null ? this.estimation : '?';
    var resp = this.responsible ? (this.responsible.firstName +' '+this.responsible.lastName) : '';
    resp = resp.length > 16 ? resp.substring(0,13)+'...' : resp;
    var styleClass = 'task ' + (resp ? 'hasResponsible' : '');
    description = description.formatLine();
    **?
    ]]>
    %{-- Task postit --}%
    <is:postit title="?**=truncatedName**?"
               id="${task.id}"
               notruncate="true"
               miniId="${task.id}"
               styleClass="?**=styleClass**?"
               type="task"
               typeNumber="?**=typeNumber**?"
               typeTitle="?**=typeTitle**?"
               stateText="?**=resp**?"
               attachment="${task.totalAttachments}"
               miniValue="?**=estimation**?"
               color="yellow"
               rect="true">
        <g:if test="${request.inProduct}">
            <is:postitMenu id="task-${task.id}"
                           contentView="/task/menu"
                           params="[id:id, task:task, user:user, template:true]"/>
        </g:if>
    </is:postit>
    ?**if (name.length > 17 || description.length > 0) {**?
    <is:tooltipPostit
            type="task"
            id="${task.id}"
            title="${task.name}"
            text="${task.description}"
            apiBeforeShow="if(jQuery('#dropmenu').is(':visible')){return false;}"
            container="jQuery('#window-content-${id}')"/>
    ?**}**?
</template>