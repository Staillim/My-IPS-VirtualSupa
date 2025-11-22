
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  MoreHorizontal,
  Search,
  PlusCircle,
  FileText,
  Download,
  XCircle,
  FilePlus,
  Send,
  Repeat,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSupabase } from '@/supabase';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'activa':
      return 'default';
    case 'vencida':
      return 'outline';
    case 'anulada':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export default function PersonalFormulasPage() {
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedFormulaId, setSelectedFormulaId] = useState<string | null>(null);
  const [newFormula, setNewFormula] = useState({ 
    patientId: '', 
    medicationName: '', 
    dosage: '', 
    observations: '',
    expirationDate: '' 
  });
  const [medications, setMedications] = useState<{name: string; dosage: string}[]>([]);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [renewalDialogOpen, setRenewalDialogOpen] = useState(false);
  const [selectedRenewalRequest, setSelectedRenewalRequest] = useState<any>(null);

  const { user, loading: isUserLoading, supabase } = useSupabase();
  const { toast } = useToast();
  
  const [formulas, setFormulas] = useState<any[]>([]);
  const [isLoadingFormulas, setIsLoadingFormulas] = useState(true);
  const [renewalRequests, setRenewalRequests] = useState<any[]>([]);
  const [isLoadingRenewals, setIsLoadingRenewals] = useState(true);
  const [allPatients, setAllPatients] = useState<any[]>([]);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);

  // Cargar fórmulas del doctor
  useEffect(() => {
    if (!user?.id || !supabase) return;
    
    const fetchFormulas = async () => {
      setIsLoadingFormulas(true);
      const { data, error } = await supabase
        .from('formulas')
        .select('*')
        .eq('doctor_id', user.id)
        .order('date', { ascending: false });
      
      if (!error && data) {
        setFormulas(data);
      }
      setIsLoadingFormulas(false);
    };
    
    fetchFormulas();
  }, [user?.id, supabase]);

  // Cargar solicitudes de renovación
  useEffect(() => {
    if (!user?.id || !supabase) return;
    
    const fetchRenewals = async () => {
      setIsLoadingRenewals(true);
      const { data, error } = await supabase
        .from('formula_renewal_requests')
        .select(`
          *,
          patient:users!formula_renewal_requests_patient_id_fkey(id, display_name, photo_url, email)
        `)
        .eq('doctor_id', user.id)
        .eq('status', 'pendiente')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        const transformedData = data.map(renewal => ({
          ...renewal,
          patient_name: renewal.patient?.display_name || 'Paciente',
          patient_photo: renewal.patient?.photo_url || null,
          patient_email: renewal.patient?.email || ''
        }));
        setRenewalRequests(transformedData);
      }
      setIsLoadingRenewals(false);
    };
    
    fetchRenewals();
  }, [user?.id, supabase]);

  // Cargar todos los pacientes
  useEffect(() => {
    if (!supabase) return;
    
    const fetchPatients = async () => {
      setIsLoadingPatients(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'PACIENTE')
        .order('display_name', { ascending: true });
      
      if (!error && data) {
        setAllPatients(data);
      }
      setIsLoadingPatients(false);
    };
    
    fetchPatients();
  }, [supabase]);

  // Get unique patient IDs from recent formulas for the "Recent Patients" section
  const recentPatientIds = [...new Set(formulas?.map(f => f.patient_id || f.user_id) || [])].slice(0, 5);
  const recentPatients = allPatients?.filter(p => recentPatientIds.includes(p.id)) || [];  // Filtrar pacientes por búsqueda
  const filteredPatients = allPatients?.filter(patient => 
    patient.display_name?.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(patientSearchTerm.toLowerCase())
  ) || [];

  const selectedPatient = allPatients?.find(p => p.id === newFormula.patientId);

  // Auto-expirar fórmulas vencidas
  useEffect(() => {
    if (!formulas || !supabase) return;

    const checkExpiredFormulas = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      for (const formula of formulas) {
        if (formula.status === 'activa' && formula.expiration_date && formula.expiration_date < today) {
          try {
            await supabase
              .from('formulas')
              .update({
                status: 'vencida',
                expired_at: new Date().toISOString(),
              })
              .eq('id', formula.id);
          } catch (error) {
            console.error('Error al actualizar fórmula vencida:', error);
          }
        }
      }
    };

    checkExpiredFormulas();
  }, [formulas, supabase]);

  const handleAddMedication = () => {
    if (newFormula.medicationName && newFormula.dosage) {
        setMedications([...medications, { name: newFormula.medicationName, dosage: newFormula.dosage }]);
        setNewFormula(prev => ({...prev, medicationName: '', dosage: ''}));
    }
  }

  const handleCreateFormula = async () => {
    const patient = allPatients?.find(p => p.id === newFormula.patientId);

    if (!user || !supabase || !patient || medications.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes seleccionar un paciente y añadir al menos un medicamento.",
      });
      return;
    }

    if (!newFormula.expirationDate) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes especificar la fecha de vencimiento de la fórmula.",
      });
      return;
    }

    try {
      // Obtener datos del doctor
      const { data: doctorData } = await supabase
        .from('users')
        .select('display_name')
        .eq('id', user.id)
        .single();

      const formulaData = {
        patient_id: patient.id,
        patient_name: patient.display_name,
        doctor_id: user.id,
        doctor_name: doctorData?.display_name || 'Médico',
        date: new Date().toISOString().split('T')[0],
        expiration_date: newFormula.expirationDate,
        medications: medications,
        observations: newFormula.observations,
        status: 'activa',
        digital_signature: null,
      };

      const { error: formulaError } = await supabase
        .from('formulas')
        .insert([formulaData]);

      if (formulaError) throw formulaError;

      // Crear notificación para el paciente
      const { error: notifError } = await supabase
        .from('notifications')
        .insert([{
          user_id: patient.id,
          type: 'formula_created',
          title: 'Fórmula Médica Emitida',
          message: `El Dr. ${doctorData?.display_name || 'Médico'} ha emitido una fórmula médica para ti con ${medications.length} medicamento(s). Válida hasta el ${new Date(newFormula.expirationDate).toLocaleDateString('es-CO')}. Revísala en la sección de fórmulas.`,
          read: false,
          created_at: new Date().toISOString(),
        }]);

      if (notifError) throw notifError;

      toast({ title: 'Fórmula Creada', description: 'La receta ha sido enviada al paciente.' });
      setOpen(false);
      setNewFormula({ patientId: '', medicationName: '', dosage: '', observations: '', expirationDate: '' });
      setMedications([]);
      setPatientSearchTerm('');
      
      // Recargar fórmulas
      const { data } = await supabase
        .from('formulas')
        .select('*')
        .eq('doctor_id', user.id)
        .order('date', { ascending: false });
      if (data) setFormulas(data);
    } catch (error) {
      console.error('Error al crear fórmula:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo crear la fórmula.',
      });
    }
  };

  const handleViewDetails = (formulaId: string) => {
    setSelectedFormulaId(formulaId);
    setDetailsOpen(true);
  };

  const handleCancelFormula = async (formulaId: string) => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('formulas')
        .update({ status: 'anulada' })
        .eq('id', formulaId);
      
      if (error) throw error;
      
      toast({
        title: 'Fórmula Anulada',
        description: 'La fórmula ha sido anulada exitosamente.',
      });
      
      // Recargar fórmulas
      if (user?.id) {
        const { data } = await supabase
          .from('formulas')
          .select('*')
          .eq('doctor_id', user.id)
          .order('date', { ascending: false });
        if (data) setFormulas(data);
      }
    } catch (error) {
      console.error('Error al anular fórmula:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo anular la fórmula.',
      });
    }
  };

  const handleDownloadPDF = async (formula: any) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      let yPos = 20;

      // Encabezado
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('FÓRMULA MÉDICA', pageWidth / 2, yPos, { align: 'center' });
      yPos += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Fecha de Emisión: ${format(new Date(formula.date), 'dd/MM/yyyy')}`, pageWidth / 2, yPos, { align: 'center' });
      yPos += 3;
      
      if (formula.expiration_date) {
        doc.text(`Válida hasta: ${format(new Date(formula.expiration_date), 'dd/MM/yyyy')}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 3;
      }

      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(`Estado: ${formula.status?.toUpperCase() || 'ACTIVA'}`, pageWidth / 2, yPos, { align: 'center' });
      yPos += 15;

      // Información del Paciente
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text('INFORMACIÓN DEL PACIENTE', margin, yPos);
      yPos += 7;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Nombre: ${formula.patient_name}`, margin, yPos);
      yPos += 5;
      doc.text(`ID: ${formula.patient_id}`, margin, yPos);
      yPos += 12;

      // Información del Médico
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('INFORMACIÓN DEL MÉDICO', margin, yPos);
      yPos += 7;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Dr./Dra. ${formula.doctor_name}`, margin, yPos);
      yPos += 5;
      doc.text(`Registro Médico: ${formula.doctor_id}`, margin, yPos);
      yPos += 12;

      // Medicamentos
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('MEDICAMENTOS PRESCRITOS', margin, yPos);
      yPos += 7;

      // Tabla de medicamentos
      const medicationsData = formula.medications?.map((med: any, index: number) => [
        (index + 1).toString(),
        med.name,
        med.dosage
      ]) || [];

      autoTable(doc, {
        startY: yPos,
        head: [['#', 'Medicamento', 'Dosis e Indicaciones']],
        body: medicationsData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], fontSize: 10, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 4 },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 60 },
          2: { cellWidth: 'auto' }
        },
        margin: { left: margin, right: margin }
      });

      yPos = (doc as any).lastAutoTable.finalY + 10;

      // Observaciones
      if (formula.observations) {
        // Verificar si hay espacio suficiente, si no, nueva página
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('OBSERVACIONES MÉDICAS', margin, yPos);
        yPos += 7;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const splitObservations = doc.splitTextToSize(formula.observations, pageWidth - (margin * 2));
        doc.text(splitObservations, margin, yPos);
        yPos += (splitObservations.length * 5) + 10;
      }

      // Firma (espacio para firma física si es necesario)
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      yPos += 20;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('_________________________________', pageWidth / 2, yPos, { align: 'center' });
      yPos += 5;
      doc.text(`Dr./Dra. ${formula.doctor_name}`, pageWidth / 2, yPos, { align: 'center' });
      yPos += 4;
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text('Firma del Médico', pageWidth / 2, yPos, { align: 'center' });

      // Pie de página
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Fórmula Médica - Página ${i} de ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      // Descargar
      const fileName = `Formula_${formula.patient_name.replace(/\s+/g, '_')}_${format(new Date(formula.date), 'yyyyMMdd')}.pdf`;
      doc.save(fileName);

      toast({
        title: 'PDF Descargado',
        description: `La fórmula se ha descargado como ${fileName}`,
      });
    } catch (error) {
      console.error('Error al generar PDF:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo generar el PDF de la fórmula.',
      });
    }
  };

  // Funciones para manejar solicitudes de renovación
  const handleOpenRenewalDialog = (request: any) => {
    setSelectedRenewalRequest(request);
    setRenewalDialogOpen(true);
  };

  const handleApproveRenewal = async () => {
    if (!selectedRenewalRequest || !user || !supabase) return;

    try {
      // Obtener datos del doctor
      const { data: doctorData, error: doctorError } = await supabase
        .from('users')
        .select('display_name, photo_url')
        .eq('id', user.id)
        .single();

      if (doctorError) {
        console.error('Error obteniendo datos del doctor:', doctorError);
        throw doctorError;
      }

      // Crear nueva fórmula con los mismos medicamentos
      const newFormulaData = {
        patient_id: selectedRenewalRequest.patient_id,
        patient_name: selectedRenewalRequest.patient_name,
        doctor_id: user.id,
        doctor_name: doctorData?.display_name || 'Médico',
        date: new Date().toISOString().split('T')[0],
        medications: selectedRenewalRequest.medications,
        observations: `Renovación de fórmula del ${format(new Date(selectedRenewalRequest.original_date), 'dd/MM/yyyy')}`,
        status: 'activa',
        digital_signature: null,
        is_renewal: true,
        original_formula_id: selectedRenewalRequest.formula_id,
      };

      const { error: formulaError } = await supabase
        .from('formulas')
        .insert([newFormulaData]);

      if (formulaError) {
        console.error('Error creando fórmula:', formulaError);
        throw formulaError;
      }

      // Actualizar estado de la solicitud
      const { error: updateError } = await supabase
        .from('formula_renewal_requests')
        .update({
          status: 'aprobada',
          responded_at: new Date().toISOString(),
        })
        .eq('id', selectedRenewalRequest.id);

      if (updateError) {
        console.error('Error actualizando estado:', updateError);
        throw updateError;
      }

      // Notificar al paciente
      const { error: notifError } = await supabase
        .from('notifications')
        .insert([{
          user_id: selectedRenewalRequest.patient_id,
          type: 'renewal_approved',
          title: 'Renovación de Fórmula Aprobada',
          message: `El Dr. ${doctorData?.display_name || 'Médico'} ha aprobado tu solicitud de renovación de fórmula.`,
          read: false,
          created_at: new Date().toISOString(),
        }]);

      if (notifError) {
        console.error('Error creando notificación:', notifError);
        throw notifError;
      }

      toast({
        title: 'Renovación Aprobada',
        description: 'Se ha creado una nueva fórmula para el paciente.',
      });

      setRenewalDialogOpen(false);
      setSelectedRenewalRequest(null);
      
      // Recargar fórmulas y solicitudes
      const { data: formulasData } = await supabase
        .from('formulas')
        .select('*')
        .eq('doctor_id', user.id)
        .order('date', { ascending: false });
      if (formulasData) setFormulas(formulasData);
      
      const { data: renewalsData } = await supabase
        .from('formula_renewal_requests')
        .select(`
          *,
          patient:users!formula_renewal_requests_patient_id_fkey(id, display_name, photo_url, email)
        `)
        .eq('doctor_id', user.id)
        .eq('status', 'pendiente')
        .order('created_at', { ascending: false });
      if (renewalsData) {
        const transformedData = renewalsData.map(renewal => ({
          ...renewal,
          patient_name: renewal.patient?.display_name || 'Paciente',
          patient_photo: renewal.patient?.photo_url || null,
          patient_email: renewal.patient?.email || ''
        }));
        setRenewalRequests(transformedData);
      }
    } catch (error) {
      console.error('Error al aprobar renovación:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo aprobar la renovación.',
      });
    }
  };

  const handleRejectRenewal = async () => {
    if (!selectedRenewalRequest || !user || !supabase) return;

    try {
      // Obtener datos del doctor
      const { data: doctorData, error: doctorError } = await supabase
        .from('users')
        .select('display_name')
        .eq('id', user.id)
        .single();

      if (doctorError) {
        console.error('Error obteniendo datos del doctor:', doctorError);
        throw doctorError;
      }

      // Actualizar estado de la solicitud
      const { error: updateError } = await supabase
        .from('formula_renewal_requests')
        .update({
          status: 'rechazada',
          responded_at: new Date().toISOString(),
        })
        .eq('id', selectedRenewalRequest.id);

      if (updateError) {
        console.error('Error actualizando estado:', updateError);
        throw updateError;
      }

      // Notificar al paciente
      const { error: notifError } = await supabase
        .from('notifications')
        .insert([{
          user_id: selectedRenewalRequest.patient_id,
          type: 'renewal_rejected',
          title: 'Solicitud de Renovación Revisada',
          message: `El Dr. ${doctorData?.display_name || 'Médico'} ha revisado tu solicitud. La renovación no es necesaria en este momento. Si necesitas una nueva evaluación, por favor agenda una cita.`,
          read: false,
          created_at: new Date().toISOString(),
        }]);

      if (notifError) {
        console.error('Error creando notificación:', notifError);
        throw notifError;
      }

      toast({
        title: 'Renovación Rechazada',
        description: 'Se ha notificado al paciente.',
      });

      setRenewalDialogOpen(false);
      setSelectedRenewalRequest(null);
      
      // Recargar solicitudes
      const { data: renewalsData } = await supabase
        .from('formula_renewal_requests')
        .select(`
          *,
          patient:users!formula_renewal_requests_patient_id_fkey(id, display_name, photo_url, email)
        `)
        .eq('doctor_id', user.id)
        .eq('status', 'pendiente')
        .order('created_at', { ascending: false });
      if (renewalsData) {
        const transformedData = renewalsData.map(renewal => ({
          ...renewal,
          patient_name: renewal.patient?.display_name || 'Paciente',
          patient_photo: renewal.patient?.photo_url || null,
          patient_email: renewal.patient?.email || ''
        }));
        setRenewalRequests(transformedData);
      }
    } catch (error) {
      console.error('Error al rechazar renovación:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo rechazar la renovación.',
      });
    }
  };

  const selectedFormulaDetails = formulas?.find(f => f.id === selectedFormulaId);

  return (
    <>
      <Header />
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold font-headline">
              Gestión de Fórmulas
            </h1>
            <p className="text-muted-foreground">
              Crea y administra las recetas médicas de tus pacientes.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear Nueva Fórmula
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  <FilePlus className="h-6 w-6 text-blue-600" />
                  Emitir Nueva Fórmula Médica
                </DialogTitle>
                <DialogDescription>
                  Completa los campos para generar una nueva receta. La firma se agregará automáticamente.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Sección: Selección de Paciente */}
                <div className="space-y-3">
                  <Label htmlFor="patient-search" className="text-base font-semibold">
                    Seleccionar Paciente
                  </Label>
                  
                  {/* Buscador */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="patient-search"
                      placeholder="Buscar por nombre o correo..."
                      className="pl-10"
                      value={patientSearchTerm}
                      onChange={(e) => setPatientSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Paciente seleccionado */}
                  {selectedPatient && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Avatar className="h-12 w-12 border-2 border-blue-300">
                        <AvatarImage src={selectedPatient.photo_url} alt={selectedPatient.display_name} />
                        <AvatarFallback className="bg-blue-200 text-blue-700 font-semibold">
                          {selectedPatient.display_name?.charAt(0) || 'P'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900">Paciente seleccionado:</p>
                        <p className="text-sm font-semibold text-blue-700">{selectedPatient.display_name}</p>
                        <p className="text-xs text-blue-600">{selectedPatient.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setNewFormula(prev => ({ ...prev, patientId: '' }))}
                        className="h-8 w-8 hover:bg-red-100 shrink-0"
                        title="Deseleccionar paciente"
                      >
                        <XCircle className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  )}

                  {/* Lista de pacientes recientes */}
                  {!patientSearchTerm && recentPatients.length > 0 && !selectedPatient && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Pacientes recientes:</p>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {recentPatients.map((patient) => (
                          <button
                            key={patient.id}
                            type="button"
                            onClick={() => setNewFormula(prev => ({ ...prev, patientId: patient.id }))}
                            className="w-full flex items-center gap-3 text-left p-3 rounded-lg border hover:bg-blue-50 hover:border-blue-300 transition-colors"
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={patient.photo_url} alt={patient.display_name} />
                              <AvatarFallback className="bg-blue-100 text-blue-700">
                                {patient.display_name?.charAt(0) || 'P'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{patient.display_name}</p>
                              <p className="text-xs text-muted-foreground">{patient.email}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lista de pacientes filtrados */}
                  {patientSearchTerm && filteredPatients.length > 0 && (
                    <div className="space-y-1 max-h-60 overflow-y-auto border rounded-lg p-2">
                      {filteredPatients.map((patient) => (
                        <button
                          key={patient.id}
                          type="button"
                          onClick={() => {
                            setNewFormula(prev => ({ ...prev, patientId: patient.id }));
                            setPatientSearchTerm('');
                          }}
                          className="w-full flex items-center gap-3 text-left p-3 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={patient.photo_url} alt={patient.display_name} />
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {patient.display_name?.charAt(0) || 'P'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{patient.display_name}</p>
                            <p className="text-xs text-muted-foreground">{patient.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {patientSearchTerm && filteredPatients.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No se encontraron pacientes con ese criterio.
                    </p>
                  )}
                </div>

                <div className="border-t pt-6" />

                {/* Sección: Medicamentos */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Medicamentos Recetados</Label>
                  
                  {/* Lista de medicamentos agregados */}
                  {medications.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {medications.map((med, index) => (
                        <div key={index} className="flex justify-between items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-blue-900">{med.name}</p>
                            <p className="text-xs text-blue-700 mt-1">{med.dosage}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setMedications(meds => meds.filter((_, i) => i !== index))}
                            className="h-8 w-8 hover:bg-red-100"
                          >
                            <XCircle className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Formulario para agregar medicamento */}
                  <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                    <div className="space-y-2">
                      <Label htmlFor="medication-name" className="text-sm">
                        Nombre del Medicamento
                      </Label>
                      <Input
                        id="medication-name"
                        placeholder="Ej: Acetaminofén 500mg"
                        value={newFormula.medicationName}
                        onChange={e => setNewFormula(p => ({...p, medicationName: e.target.value}))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medication-dosage" className="text-sm">
                        Dosis e Indicaciones
                      </Label>
                      <Textarea
                        id="medication-dosage"
                        placeholder="Ej: 1 tableta cada 8 horas por 3 días"
                        rows={2}
                        value={newFormula.dosage}
                        onChange={e => setNewFormula(p => ({...p, dosage: e.target.value}))}
                      />
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddMedication}
                      className="w-full"
                      disabled={!newFormula.medicationName || !newFormula.dosage}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Agregar Medicamento
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-6" />

                {/* Sección: Observaciones */}
                <div className="space-y-2">
                  <Label htmlFor="observations" className="text-base font-semibold">
                    Observaciones Generales
                  </Label>
                  <Textarea
                    id="observations"
                    placeholder="Indicaciones adicionales para el paciente (dieta, actividades, precauciones, etc.)"
                    rows={4}
                    value={newFormula.observations}
                    onChange={e => setNewFormula(p => ({...p, observations: e.target.value}))}
                  />
                </div>

                <div className="border-t pt-6" />

                {/* Sección: Fecha de Vencimiento */}
                <div className="space-y-2">
                  <Label htmlFor="expirationDate" className="text-base font-semibold">
                    Fecha de Vencimiento <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Establece hasta qué fecha será válida esta fórmula médica
                  </p>
                  <Input
                    id="expirationDate"
                    type="date"
                    value={newFormula.expiration_date}
                    onChange={e => setNewFormula(p => ({...p, expirationDate: e.target.value}))}
                    min={new Date().toISOString().split('T')[0]}
                    className="max-w-xs"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancelar</Button>
                </DialogClose>
                <Button 
                  type="submit" 
                  onClick={handleCreateFormula}
                  disabled={!newFormula.patientId || medications.length === 0 || !newFormula.expirationDate}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  Guardar y Enviar Fórmula
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Solicitudes de Renovación Pendientes */}
        {renewalRequests && renewalRequests.length > 0 && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20 dark:border-yellow-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <Repeat className="h-5 w-5" />
                Solicitudes de Renovación Pendientes ({renewalRequests.length})
              </CardTitle>
              <CardDescription>Pacientes que solicitan renovar sus fórmulas médicas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {renewalRequests.map((request: any) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {request.patient_name?.charAt(0) || 'P'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{request.patient_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Fórmula original: {format(new Date(request.original_date), 'dd/MM/yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 ml-12">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Motivo:</span> {request.reason}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="font-medium">Medicamentos:</span> {request.medications?.map((m: any) => m.name).join(', ')}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenRenewalDialog(request)}
                      className="ml-4"
                    >
                      Revisar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por paciente o fórmula..."
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Fecha Emisión</TableHead>
                  <TableHead>Medicamentos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingFormulas && [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                ))}
                {formulas?.map((formula: any) => (
                  <TableRow key={formula.id}>
                    <TableCell className="font-medium">
                      {formula.patient_name}
                    </TableCell>
                    <TableCell>{format(new Date(formula.date), 'PPP')}</TableCell>
                    <TableCell>
                      {formula.medications[0].name}
                      {formula.medications.length > 1 &&
                        ` (+${formula.medications.length - 1})`}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(formula.status || 'activa')}>
                        {formula.status ? (formula.status.charAt(0).toUpperCase() + formula.status.slice(1)) : 'Activa'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(formula.id)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadPDF(formula)}>
                            <Download className="mr-2 h-4 w-4" />
                            Descargar PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleCancelFormula(formula.id)}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Anular fórmula
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
           <CardFooter className="py-4 text-sm text-muted-foreground">
             Mostrando {formulas?.length ?? 0} de {formulas?.length ?? 0} fórmulas.
          </CardFooter>
        </Card>

        {/* Dialog para ver detalles de la fórmula */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Detalles de la Fórmula Médica</DialogTitle>
              <DialogDescription>
                Información completa de la receta médica
              </DialogDescription>
            </DialogHeader>
            
            {selectedFormulaDetails && (
              <div className="space-y-6">
                {/* Información del Paciente */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg border-b pb-2">Información del Paciente</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre</p>
                      <p className="font-medium">{selectedFormulaDetails.patient_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estado</p>
                      <Badge variant={getStatusVariant(selectedFormulaDetails.status || 'activa')}>
                        {selectedFormulaDetails.status ? (selectedFormulaDetails.status.charAt(0).toUpperCase() + selectedFormulaDetails.status.slice(1)) : 'Activa'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Información del Médico */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg border-b pb-2">Información del Médico</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Médico</p>
                      <p className="font-medium">{selectedFormulaDetails.doctor_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha de Emisión</p>
                      <p className="font-medium">{format(new Date(selectedFormulaDetails.date), 'PPP')}</p>
                    </div>
                  </div>
                </div>

                {/* Medicamentos Prescritos */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg border-b pb-2">Medicamentos Prescritos</h3>
                  <div className="space-y-3">
                    {selectedFormulaDetails.medications?.map((med: any, index: number) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-lg">{med.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              <span className="font-medium">Dosis:</span> {med.dosage}
                            </p>
                          </div>
                          <Badge variant="outline">{index + 1}</Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Observaciones */}
                {selectedFormulaDetails.observations && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg border-b pb-2">Observaciones Médicas</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{selectedFormulaDetails.observations}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                Cerrar
              </Button>
              {selectedFormulaDetails && (
                <>
                  <Button 
                    variant="default" 
                    onClick={() => {
                      handleDownloadPDF(selectedFormulaDetails);
                      setDetailsOpen(false);
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Descargar PDF
                  </Button>
                  {selectedFormulaDetails.status !== 'anulada' && (
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        handleCancelFormula(selectedFormulaDetails.id);
                        setDetailsOpen(false);
                      }}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Anular Fórmula
                    </Button>
                  )}
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo para Revisar Solicitud de Renovación */}
        <Dialog open={renewalDialogOpen} onOpenChange={setRenewalDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Repeat className="h-5 w-5 text-primary" />
                Solicitud de Renovación de Fórmula
              </DialogTitle>
              <DialogDescription>
                Revisa la solicitud y decide si aprobar la renovación
              </DialogDescription>
            </DialogHeader>

            {selectedRenewalRequest && (
              <div className="space-y-4 py-4">
                {/* Información del Paciente */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <Label className="text-xs text-muted-foreground">Paciente</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Avatar className="h-12 w-12">
                      {selectedRenewalRequest.patient_photo ? (
                        <AvatarImage src={selectedRenewalRequest.patient_photo} alt={selectedRenewalRequest.patient_name || 'Paciente'} />
                      ) : null}
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {selectedRenewalRequest.patient_name?.charAt(0) || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg">{selectedRenewalRequest.patient_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Solicitud enviada: {selectedRenewalRequest.created_at ? 
                          format(new Date(selectedRenewalRequest.created_at), "dd/MM/yyyy 'a las' HH:mm") : 
                          'Fecha no disponible'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fórmula Original */}
                <div>
                  <Label className="text-sm font-semibold">Fórmula Original</Label>
                  <div className="mt-2 p-3 border rounded-lg bg-background">
                    <p className="text-sm text-muted-foreground mb-2">
                      Emitida el: {format(new Date(selectedRenewalRequest.original_date), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                    </p>
                    <div className="space-y-2">
                      {selectedRenewalRequest.medications?.map((med: any, index: number) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">{med.name}</p>
                            <p className="text-muted-foreground text-xs">{med.dosage}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Motivo de la Renovación */}
                <div>
                  <Label className="text-sm font-semibold">Motivo de la Renovación</Label>
                  <div className="mt-2 p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                    <p className="text-sm">{selectedRenewalRequest.reason}</p>
                  </div>
                </div>

                {/* Advertencia */}
                <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <Search className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">Verificación Requerida</p>
                    <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                      Asegúrate de que el paciente aún requiere estos medicamentos antes de aprobar la renovación.
                      Si tienes dudas, solicita una nueva consulta.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 flex-col sm:flex-row">
              <div className="flex gap-2 w-full sm:w-auto">
                <Button 
                  variant="outline"
                  onClick={() => setRenewalDialogOpen(false)}
                  className="flex-1 sm:flex-initial"
                >
                  Cancelar
                </Button>
                <Button 
                  variant="secondary"
                  onClick={handleRejectRenewal}
                  className="flex-1 sm:flex-initial"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  No Necesario
                </Button>
              </div>
              <Button 
                onClick={handleApproveRenewal}
                className="w-full sm:w-auto"
              >
                <FileText className="mr-2 h-4 w-4" />
                Aprobar y Crear Nueva Fórmula
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
